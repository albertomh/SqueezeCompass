
// ----- 1/3 FILTER ------------------------------------------------------------

export enum FilterSentiment {  // fms:
  s,  // sell
  h,  // hold
  b,  // buy
}

export enum FilterCap {  // fcp:
  lt,  // lower than $½tn
  bt,  // between $½-1tn
  gt,  // greater than $1tn
}


// ----- 2/3 SORT --------------------------------------------------------------

export enum SortBy {  // so:
  al,  // alphabetical
  re,  // reverse alphabetical
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
