#
# Alberto MH 2021
#

from typing import (
    List,
    Dict,
    Union,
)
from datetime import datetime, date

from sqlalchemy.orm.session import Session

import conf
from fetch.symbol_fetcher import SymbolFetcher
from fetch.data_fetcher import DataFetcher
from db.connection import DatabaseConnection


class SqueezeCompass:
    def __init__(self) -> None:
        #

        # 0. Instantiate structures needed to connect to the database, and
        #    create tables if they don't yet exist.
        self.db = DatabaseConnection()
        self.db_session: Session = self.db.get_db_session()

        # 1. Load a list of symbols into memory (will carry out checks on
        #    freshness of constituents file and re-fetch if stale).
        self.symbol_fetcher = SymbolFetcher()
        symbols: List[str] = self.symbol_fetcher.get_symbols()

        # 2. Initialise the fetcher that will collect data for every symbol in the S&P500.
        self.data_fetcher = DataFetcher(symbols, self.db_session)

        # 3. Fetch data for only the first symbol to check whether `key_stats__date_short_interest` has
        #    changed relative to the last recorded fetch. If it has, all data will be fetched again.
        self.date_of_last_snapshot: date = self.data_fetcher.get_date_of_last_snapshot()
        if self.date_of_last_snapshot is not None:
            self.prev_short_interest_date: date = self.data_fetcher.get_date_short_interest_for_last_snapshot()
        single_symbol_data: Dict[str, Union[str, dict, datetime]] = DataFetcher.fetch_data_for_single_symbol(symbols[0])
        self.cur_short_interest_date: date = single_symbol_data['key_stats']['date_short_interest']


if __name__ == '__main__':
    squeeze_compass = SqueezeCompass()

    if squeeze_compass.date_of_last_snapshot is not None:
        if squeeze_compass.cur_short_interest_date > squeeze_compass.prev_short_interest_date:
            print(f"{conf.TIMESTAMP()} | There has been an update to the short interest figures since last ",
                  f"snapshot on {squeeze_compass.date_of_last_snapshot}. Re-scraping data now.")
            squeeze_compass.data_fetcher.fetch_new_daily_snapshot()
            squeeze_compass.data_fetcher.save_snapshot_as_json()
        else:
            print(f"{conf.TIMESTAMP()} | prev_short_interest_date {squeeze_compass.prev_short_interest_date} | cur_short_interest_date {squeeze_compass.cur_short_interest_date}.")
            print(f"{conf.TIMESTAMP()} | Data has not changed since the last snapshot on {squeeze_compass.date_of_last_snapshot}.")
    else:
        print(f"{conf.TIMESTAMP()} | Performing first data snapshot.")
        squeeze_compass.data_fetcher.fetch_new_daily_snapshot()
        squeeze_compass.data_fetcher.save_snapshot_as_json()
