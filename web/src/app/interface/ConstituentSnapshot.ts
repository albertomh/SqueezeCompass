interface ConstituentSnapshotSummary {
  recommendation: string;
}

interface ConstituentSnapshotFinancial {
  market_cap: number;
}

interface ConstituentSnapshotKeyStats {
  short_percent_of_float: number;
}

export interface ConstituentSnapshot {
  symbol: string;
  summary: ConstituentSnapshotSummary;
  financial: ConstituentSnapshotFinancial;
  key_stats: ConstituentSnapshotKeyStats;
}
