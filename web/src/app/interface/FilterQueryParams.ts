export interface FilterQueryParams {
  [key: string]: string | undefined;
  fms?: string | undefined;  // filter market sentiment
  fcp?: string | undefined;  // filter market cap
  so?: string | undefined;  // sort by
  vi?: string | undefined;  // visualise - colour scheme
}
