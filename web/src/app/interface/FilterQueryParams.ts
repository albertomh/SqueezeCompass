export interface FilterQueryParams {
  [key: string]: string | undefined;
  fms?: string | undefined;  // filter market sentiment
  so?: string | undefined;  // sort by
  cs?: string | undefined;  // colour scheme
}
