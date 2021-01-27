interface ConstituentSnapshotSummary {
  recommendation: string;
  avg_vol_3_months: number;
  avg_vol_10_days: number;
}

interface ConstituentSnapshotFinancial {
  market_cap: number;
  current_price: number;
  gross_profits: number;
  free_cashflow: number;
  total_cash: number;
  total_debt: number;
  total_revenue: number;
  revenue_per_share: number;
}

interface ConstituentSnapshotKeyStats {
  shares_outstanding: number;
  float_shares: number;
  shares_short: number;
  short_ratio: number;
  short_percent_of_float: number;
  date_short_interest: string;
}

export interface ConstituentSnapshot {
  symbol: string;
  summary: ConstituentSnapshotSummary;
  financial: ConstituentSnapshotFinancial;
  key_stats: ConstituentSnapshotKeyStats;
}
