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
from scrape.symbol_fetcher import SymbolFetcher
from scrape.data_scraper import DataScraper
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

        # 2. Initialise the scraper that will fetch data for every symbol in the S&P500.
        self.data_scraper = DataScraper(symbols, self.db_session)

        # 3. Scrape data for only the first symbol to check whether `key_stats__date_short_interest` has
        #    changed relative to the last recorded scrape. If it has, all data will be scraped again.
        self.date_of_last_snapshot: date = self.data_scraper.get_date_of_last_snapshot()
        if self.date_of_last_snapshot is not None:
            self.prev_short_interest_date: date = self.data_scraper.get_date_short_interest_for_last_snapshot()
        single_symbol_data: Dict[str, Union[str, dict, datetime]] = DataScraper.scrape_data_for_single_symbol(symbols[0])
        self.cur_short_interest_date: date = single_symbol_data['key_stats']['date_short_interest']


if __name__ == '__main__':
    squeeze_compass = SqueezeCompass()

    if squeeze_compass.date_of_last_snapshot is not None:
        if squeeze_compass.cur_short_interest_date > squeeze_compass.prev_short_interest_date:
            print(f"{conf.TIMESTAMP()} | There has been an update to the short interest figures since the last ",
                  f"scrape on {squeeze_compass.date_of_last_snapshot}. Re-scraping data now.")
            squeeze_compass.data_scraper.scrape_new_daily_snapshot()
            squeeze_compass.data_scraper.save_snapshot_as_json()
        else:
            print(f"{conf.TIMESTAMP()} | prev_short_interest_date {squeeze_compass.prev_short_interest_date} | cur_short_interest_date {squeeze_compass.cur_short_interest_date}.")
            print(f"{conf.TIMESTAMP()} | Data has not changed since the last scrape on {squeeze_compass.date_of_last_snapshot}.")
    else:
        print(f"{conf.TIMESTAMP()} | Performing first data scrape and snapshot.")
        squeeze_compass.data_scraper.scrape_new_daily_snapshot()
        squeeze_compass.data_scraper.save_snapshot_as_json()
