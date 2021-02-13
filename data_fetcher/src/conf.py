#
# Alberto MH 2021
#

from os import path
from typing import List, Dict
from datetime import datetime
from random import randrange


# ------ GENERAL -------------------------------------------------------------------------------------------------------
DATE_FORMAT: str = "%Y/%m/%d"
DATETIME_FORMAT: str = f"{DATE_FORMAT} %H:%M:%S"
TIMESTAMP = lambda: datetime.now().strftime(DATETIME_FORMAT)


# ------ SCRAPING ------------------------------------------------------------------------------------------------------
SP500_CONSTITUENTS_URL: list = ['0b1101000', '0b1110100', '0b1110100', '0b1110000', '0b1110011', '0b111010', '0b101111', '0b101111', '0b1100101', '0b1101110', '0b101110', '0b1110111', '0b1101001', '0b1101011', '0b1101001', '0b1110000', '0b1100101', '0b1100100', '0b1101001', '0b1100001', '0b101110', '0b1101111', '0b1110010', '0b1100111', '0b101111', '0b1110111', '0b1101001', '0b1101011', '0b1101001', '0b101111', '0b1001100', '0b1101001', '0b1110011', '0b1110100', '0b1011111', '0b1101111', '0b1100110', '0b1011111', '0b1010011', '0b100101', '0b110010', '0b110110', '0b1010000', '0b1011111', '0b110101', '0b110000', '0b110000', '0b1011111', '0b1100011', '0b1101111', '0b1101101', '0b1110000', '0b1100001', '0b1101110', '0b1101001', '0b1100101', '0b1110011']
DATASOURCE_URL_1: list = ['0b1101000', '0b1110100', '0b1110100', '0b1110000', '0b1110011', '0b111010', '0b101111', '0b101111', '0b1100110', '0b1101001', '0b1101110', '0b1100001', '0b1101110', '0b1100011', '0b1100101', '0b101110', '0b1111001', '0b1100001', '0b1101000', '0b1101111', '0b1101111', '0b101110', '0b1100011', '0b1101111', '0b1101101', '0b101111', '0b1110001', '0b1110101', '0b1101111', '0b1110100', '0b1100101', '0b101111']
DATASOURCE_URL_2: list = ['0b101111', '0b1101011', '0b1100101', '0b1111001', '0b101101', '0b1110011', '0b1110100', '0b1100001', '0b1110100', '0b1101001', '0b1110011', '0b1110100', '0b1101001', '0b1100011', '0b1110011']


# http://useragentstring.com/pages/useragentstring.php
HEADERS: List[Dict[str, str]] = [
    {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'},
    {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:61.0) Gecko/20100101 Firefox/73.0'},
    {'User-Agent': 'Mozilla/5.0 (X11; Linux; rv:74.0) Gecko/20100101 Firefox/74.0'},
    {'User-Agent': 'Mozilla/5.0 (X11; Linux ppc64le; rv:75.0) Gecko/20100101 Firefox/75.0'},
    {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:77.0) Gecko/20100101 Firefox/77.0'},

    {'User-Agent': 'Mozilla/5.0 (compatible; MSIE 10.6; Windows NT 6.1; Trident/5.0; InfoPath.2; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 2.0.50727) 3gpp-gba UNTRUSTED/1.0'},
    {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko'},
    {'User-Agent': 'Mozilla/5.0 (X11) AppleWebKit/62.41 (KHTML, like Gecko) Edge/17.10859 Safari/452.6'},
    {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19577'},
    {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582'},

    {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2866.71 Safari/537.36'},
    {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2919.83 Safari/537.36'},
    {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'},
]

def random_header() -> Dict[str, str]:
    return HEADERS[randrange(len(HEADERS))]


# ------ DATABASE ------------------------------------------------------------------------------------------------------
DB_PATH: str = f"sqlite:///{path.abspath(path.join(path.dirname(__file__), '../data', 'sqlite3.db'))}"


# ------ DATA OUTPUT DIRECTORIES ---------------------------------------------------------------------------------------
CONSTITUENTS_DATAFILE_DIR: str = f"{path.abspath(path.join(path.dirname(__file__), '../data', 'constituents'))}"
JSON_SNAPSHOT_DIR: str = f"{path.abspath(path.join(path.dirname(__file__), '../data', 'snapshots'))}"
