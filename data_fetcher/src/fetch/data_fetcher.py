#
# Alberto MH 2021
#

from os import path

from typing import (
    List,
    Dict,
    Generator,
    Union,
)
from random import randint
import re
import json
from datetime import datetime, date
from time import sleep

import sqlalchemy
from sqlalchemy import func
from sqlalchemy.orm.session import Session
import requests
from requests import Response
from bs4 import BeautifulSoup

import conf
from util import Util as util
from db.models import SymbolDailySnapshot


class DataFetcher:
    def __init__(self, symbols: List[str], db_session: Session) -> None:
        #
        self.symbols = symbols
        self.db_session = db_session

    @staticmethod
    def fetch_data_for_single_symbol(symbol: str) -> Dict[str, Union[str, dict, datetime]]:
        #
        # Some symbols have dots in the symbols list but dashes in the fetched datasource. eg. BRK.B vs BRK-B
        symbol_for_url = symbol.replace('.', '-')
        r: Response = Response()
        try:
            print(f"{conf.TIMESTAMP()} | Fetching data for {symbol}.")
            datasource_url: str = f"{util.decode_url(conf.DATASOURCE_URL_1)}{symbol_for_url}{util.decode_url(conf.DATASOURCE_URL_2)}"
            r = requests.get(datasource_url, headers=conf.random_header())
        except requests.exceptions.RequestException as e:
            print(f"{conf.TIMESTAMP()} | Attempted request for {symbol} data failed.\n{e}")

        html = str(BeautifulSoup(r.content, 'html.parser'))

        regex = re.compile(r"root\.App\.main = (.*);")
        raw_payload: str = regex.search(html).group(1)
        payload: dict = json.loads(raw_payload)
        lean_payload: dict = payload['context']['dispatcher']['stores']['QuoteSummaryStore']

        summary_detail = lean_payload['summaryDetail']
        financial_data = lean_payload['financialData']
        default_key_stats = lean_payload['defaultKeyStatistics']

        date_short_interest = default_key_stats.get('dateShortInterest', {}).get('raw')
        date_short_interest = None if date_short_interest is None else datetime.fromtimestamp(date_short_interest).date()

        return {
            'symbol': symbol,
            'created_on': datetime.today().date(),
            'summary': {
                'recommendation': financial_data.get('recommendationKey'),
                'avg_vol_3_months': summary_detail.get('averageVolume', {}).get('raw'),
                'avg_vol_10_days': summary_detail.get('averageVolume10days', {}).get('raw'),
            },
            'financial': {
                'market_cap': summary_detail.get('marketCap', {}).get('raw'),
                'current_price': financial_data.get('currentPrice', {}).get('raw'),
                'gross_profits': financial_data.get('grossProfits', {}).get('raw'),
                'free_cashflow': financial_data.get('freeCashflow', {}).get('raw'),
                'total_cash': financial_data.get('totalCash', {}).get('raw'),
                'total_debt': financial_data.get('totalDebt', {}).get('raw'),
                'total_revenue': financial_data.get('totalRevenue', {}).get('raw'),
                'revenue_per_share': financial_data.get('revenuePerShare', {}).get('raw'),
            },
            'key_stats': {
                'shares_outstanding': default_key_stats.get('sharesOutstanding', {}).get('raw'),
                'float_shares': default_key_stats.get('floatShares', {}).get('raw'),
                'shares_short': default_key_stats.get('sharesShort', {}).get('raw'),
                'short_ratio': default_key_stats.get('shortRatio', {}).get('raw'),
                'short_percent_of_float': default_key_stats.get('shortPercentOfFloat', {}).get('raw'),
                'date_short_interest': date_short_interest,
            }
        }

    def fetch_data_for_all_symbols(self) -> Generator[Dict[str, dict], None, None]:
        # Return a generator that returns fetched data for each symbol passed
        # into DataFetcher's constructor.
        for symbol in self.symbols:
            # Skip if the symbol under consideration has already been fetched today.
            existing_daily_snapshot = self.db_session\
                .query(SymbolDailySnapshot)\
                .filter_by(id=f"{symbol}_{datetime.today().date().isoformat()}")\
                .first()
            if existing_daily_snapshot is not None:
                print(f"{conf.TIMESTAMP()} | Skipped {symbol} since it has already been fetched today.")
                continue

            sleep(randint(2, 5))  # Buffer each request by a couple of seconds.
            yield self.fetch_data_for_single_symbol(symbol)

    def fetch_new_daily_snapshot(self):
        # Iterate over a generator of fetched stock data and store in the database.
        data_generator: Generator[Dict[str, Union[str, dict, datetime]], None, None] = self.fetch_data_for_all_symbols()

        for data in data_generator:
            new_symbol_daily_snapshot = SymbolDailySnapshot(data)
            self.db_session.add(new_symbol_daily_snapshot)
            try:
                self.db_session.commit()
            except sqlalchemy.exc.IntegrityError as e:
                self.db_session.rollback()
                print(f"{conf.TIMESTAMP()} | Data for {data['symbol']} on {data['created_on'].isoformat()} already exists in the database.\n{e}.")

    def save_snapshot_as_json(self, date: date = None):
        if date is None:
            date = datetime.today().date()

        query: list = self.db_session\
            .query(SymbolDailySnapshot)\
            .filter(func.date(SymbolDailySnapshot.created_on) == date)\
            .all()

        json_data: dict = {
            "created_on": str(date),
            "data": []
        }

        for row in query:
            row_data: dict = {
                'symbol': row.symbol,
                'summary': {
                    'recommendation': row.summary__recommendation,
                    'avg_vol_3_months': row.summary__avg_vol_3_months,
                    'avg_vol_10_days': row.summary__avg_vol_10_days,
                },
                'financial': {
                    'market_cap': row.financial__market_cap,
                    'current_price': row.financial__current_price,
                    'gross_profits': row.financial__gross_profits,
                    'free_cashflow': row.financial__free_cashflow,
                    'total_cash': row.financial__total_cash,
                    'total_debt': row.financial__total_debt,
                    'total_revenue': row.financial__total_revenue,
                    'revenue_per_share': row.financial__revenue_per_share,
                },
                'key_stats': {
                    'shares_outstanding': row.key_stats__shares_outstanding,
                    'float_shares': row.key_stats__float_shares,
                    'shares_short': row.key_stats__shares_short,
                    'short_ratio': row.key_stats__short_ratio,
                    'short_percent_of_float': row.key_stats__short_percent_of_float,
                    'date_short_interest': str(row.key_stats__date_short_interest),
                }
            }
            json_data['data'].append(row_data)

        filename: str = f"{str(date.isoformat())}_snapshot.json"
        print(f"{conf.TIMESTAMP()} | Saved JSON snapshot to {filename}.")
        with open(path.join(conf.JSON_SNAPSHOT_DIR, filename), 'w') as outfile:
            json.dump(json_data, outfile, indent=4)

    def get_date_of_last_snapshot(self) -> Union[None, date]:
        #
        fetch_dates = [date[0] for date in
                        self.db_session.query(SymbolDailySnapshot.created_on).distinct()
                        if date[0] is not None]

        if not fetch_dates:
            return None

        return sorted(fetch_dates)[-1]

    def get_date_short_interest_for_last_snapshot(self) -> date:
        #
        short_interest_dates = [date[0] for date in
                                self.db_session.query(SymbolDailySnapshot.key_stats__date_short_interest).distinct()
                                if date[0] is not None]
        return sorted(short_interest_dates)[-1]
