
// ----- 1/3 FILTER ------------------------------------------------------------

export enum FilterSentiment {  // fms:
  s,  // sell
  h,  // hold
  b,  // buy
}

export enum FilterMarketCap {  // fcp:
  lt,  // lower than 20bn
  bt,  // between 20-100bn
  gt,  // greater than 100bn
}


// ----- 2/3 SORT --------------------------------------------------------------

export enum SortBy {  // so:
  al,  // alphabetical
  ca,  // market cap
  sh,  // short ratio
  fl,  // short % of float
}


// ----- 3/3 VISUALISE ---------------------------------------------------------

export enum Visualise {  // vi:
  ms,  // market sentiment
  ca,  // market cap
  sh,  // short ratio
  rp,  // revenue per share
}
