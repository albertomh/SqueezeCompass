#
# Alberto MH 2021
#

from typing import Dict, Union
from datetime import date

from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Date,
)
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()

#def new_uuid() -> str:
#    return str(uuid.uuid4())
#id: str = Column(String, primary_key=True, default=new_uuid)

class SymbolDailySnapshot(Base):
    __tablename__ = 'symbol_daily_snapshot'
    id: str = Column(String(15), primary_key=True)
    symbol:str = Column(String(5), nullable=False)
    created_on: date = Column(Date)
    summary__recommendation: str = Column(String())
    summary__avg_vol_3_months: int = Column(Integer)
    summary__avg_vol_10_days: int = Column(Integer)
    financial__market_cap: int = Column(Integer)
    financial__current_price: float = Column(Float)
    financial__gross_profits: int = Column(Integer)
    financial__free_cashflow: int = Column(Integer)
    financial__total_cash: int = Column(Integer)
    financial__total_debt: int = Column(Integer)
    financial__total_revenue: int = Column(Integer)
    financial__revenue_per_share: float = Column(Float)
    key_stats__shares_outstanding: int = Column(Integer)
    key_stats__float_shares: int = Column(Integer)
    key_stats__shares_short: int = Column(Integer)
    key_stats__short_ratio: float = Column(Float)
    key_stats__short_percent_of_float: float = Column(Float)
    key_stats__date_short_interest: date = Column(Date)

    def __init__(self, data: Dict[str, Union[str, dict, date]]) -> None:
        self.id: str = f"{data['symbol']}_{data['created_on']}"
        self.symbol:str = data['symbol']
        self.created_on: date = data['created_on']
        self.summary__recommendation = data['summary']['recommendation']
        self.summary__avg_vol_3_months = data['summary']['avg_vol_3_months']
        self.summary__avg_vol_10_days = data['summary']['avg_vol_10_days']
        self.financial__market_cap = data['financial']['market_cap']
        self.financial__current_price = data['financial']['current_price']
        self.financial__gross_profits = data['financial']['gross_profits']
        self.financial__free_cashflow = data['financial']['free_cashflow']
        self.financial__total_cash = data['financial']['total_cash']
        self.financial__total_debt = data['financial']['total_debt']
        self.financial__total_revenue = data['financial']['total_revenue']
        self.financial__revenue_per_share = data['financial']['revenue_per_share']
        self.key_stats__shares_outstanding = data['key_stats']['shares_outstanding']
        self.key_stats__float_shares = data['key_stats']['float_shares']
        self.key_stats__shares_short = data['key_stats']['shares_short']
        self.key_stats__short_ratio = data['key_stats']['short_ratio']
        self.key_stats__short_percent_of_float = data['key_stats']['short_percent_of_float']
        self.key_stats__date_short_interest: date = data['key_stats']['date_short_interest']

    def __repr__(self) -> str:
        return f"{self.symbol} fetched on {self.created_on}"
