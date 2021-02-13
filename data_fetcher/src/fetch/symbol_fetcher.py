#
# Alberto MH 2021
#

import os
import posix
from typing import (
    List,
    Dict,
    Union,
    Iterable,
    Generator,
)
from itertools import groupby
import json
from datetime import (
    datetime,
    date,
    timedelta,
)

import requests
from requests import Response
from bs4 import BeautifulSoup

import conf
from util import Util as util


class SymbolFetcher:

    REBALANCING_MONTHS: Dict[str, int] = {"March": 3, "June": 6, "September": 9, "December": 12}

    def __init__(self) -> None:
        #
        # Update the constituents file if it is stale. Then assign a list of stock symbols to self.symbols.
        if self.constituents_file_is_stale():
            self.create_new_constituents_file([constituent for constituent in self.fetch_constituent_data()])

        self.symbols: List[str] = [constituent['symbol'] for constituent in self.read_constituent_data_from_file()]

    @staticmethod
    def fetch_constituent_data() -> Generator[Dict[str, Union[str, date]], None, None]:
        # Return a generator that yields data for a single S&P500 constituent.
        r: Response = Response()
        try:
            print(f"{conf.TIMESTAMP()} | Refetching list of symbols.")
            r = requests.get(util.decode_url(conf.SP500_CONSTITUENTS_URL), headers=conf.random_header())
        except requests.exceptions.RequestException as e:
            print(f"{conf.TIMESTAMP()} | Attempted request for list of symbols.\n{e}")

        html = BeautifulSoup(r.content, 'html.parser')
        rows = html.select('table#constituents tbody tr')
        rows = rows[1:]  # Skip the first row since it is an empty header row.

        row_data = [[cell.text.strip('\n') for cell in row.find_all('td')] for row in rows]
        row_data.append(['GME', 'GameStop', '', 'Consumer Discretionary', 'Computer & Electronics Retail', '', '', '', '1984'])

        for row in row_data:
            yield {
                # Some symbols have dots in the symbols list but dashes in the fetched datasource. eg. BRK.B vs BRK-B
                'symbol': row[0].replace('.', '-'),
                'name': row[1],
                'gics_sector': row[3],
                'gics_sub-industry': row[4],
                'added': None if not row[6] else str(datetime.strptime(row[6][0:10], '%Y-%m-%d').date()),
                'founded': row[8]
            }

    @staticmethod
    def get_last_constituents_file() -> Union[posix.DirEntry, None]:
        # Return None if there are no constituents files.
        with os.scandir(conf.CONSTITUENTS_DATAFILE_DIR) as files:
            files: list = [f for f in files if f.is_file()]

        if not files:
            return None

        return files[-1]

    @staticmethod
    def get_date_of_last_constituents_file() -> Union[date, None]:
        # Return None if there are no constituents files.
        last_constituent_file: Union[posix.DirEntry, None] = SymbolFetcher.get_last_constituents_file()

        if last_constituent_file is None:
            return None
        return datetime.strptime(last_constituent_file.name[0:10], '%Y-%m-%d').date()

    @staticmethod
    def get_path_of_last_constituents_file() -> str:
        last_constituent_file: Union[posix.DirEntry, None] = SymbolFetcher.get_last_constituents_file()
        return os.path.join(conf.CONSTITUENTS_DATAFILE_DIR, f"{last_constituent_file.name}")

    @staticmethod
    def create_new_constituents_file(data: list) -> None:
        #
        filepath: str = os.path.join(
            conf.CONSTITUENTS_DATAFILE_DIR,
            f"{datetime.today().date().isoformat()}_constituents.json"
        )

        with open(filepath, 'w') as outfile:
            json.dump(data, outfile, indent=4)

    @staticmethod
    def read_constituent_data_from_file():
        #
        data: dict
        with open(SymbolFetcher.get_path_of_last_constituents_file(), 'r') as infile:
            data = json.loads(infile.read())
        return data

    def get_symbols(self) -> List[str]:
        return self.symbols

    @staticmethod
    def constituents_file_is_stale() -> bool:
        # Ascertain whether the data in the symbols datafile is stale.
        date_of_last_constituents_update: date = SymbolFetcher.get_date_of_last_constituents_file()

        if date_of_last_constituents_update is None:
            print(f"{conf.TIMESTAMP()} | Constituents file is nonexistent, scraping a new one.")
            return True

        def all_fridays(year) -> Iterable[date]:
            d: date = date(year, 1, 1)  # January 1st
            d += timedelta(days=(4 - d.weekday()))
            while d.year == year:
                yield d
                d += timedelta(days=7)

        # Get all Fridays in the current year and group them by month.
        all_fridays_in_current_year: List[date] = [f for f in all_fridays(datetime.now().year)]
        fridays_by_month: Dict[int, List[date]] = {month: list(f for f in fridays_iter)
                                                   for month, fridays_iter in groupby(all_fridays_in_current_year, lambda f: f.month)}
        # Transform to a dict like {month_int: single_date} where the date is the third Friday in the respective month.
        all_third_fridays: Dict[int, date] = {k: [x for i, x in enumerate(v) if i == 2][0]
                                              for k, v in fridays_by_month.items()}
        # Filter to the months when rebalancing of the S&P500 takes place.
        rebalancing_fridays: List[date] = list({k: v for k, v in all_third_fridays.items()
                                                if k in list(SymbolFetcher.REBALANCING_MONTHS.values())}.values())

        # Check whether the current date is 1) within the date range when rebalancing occurs during the year
        # and 2) whether the _s&p500.json datafile is stale per the lastUpdatedAt metadata.
        rebalancing_friday_in_the_past: bool
        if rebalancing_fridays[0] <= date.today() <= rebalancing_fridays[3]:
            for friday in rebalancing_fridays:
                if date_of_last_constituents_update < friday <= date.today():
                    print(f"{conf.TIMESTAMP()} | The S&P500 may have rebalanced since constituent data was",
                          f"last fetched on {date_of_last_constituents_update}.")
                    return True
        else:
            print(f"{conf.TIMESTAMP()} | Today is outside the S&P500 rebalancing daterange,",
                  "skipping stale constituents data checks.")
            return False

        print(f"{conf.TIMESTAMP()} | Constituents file is fresh, last updated on {date_of_last_constituents_update}.")
        return False
