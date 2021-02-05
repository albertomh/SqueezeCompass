export interface FilterQueryParams {
  [key: string]: string | undefined;
  fms?: string | undefined;  // filter market sentiment
  so?: string | undefined;  // sort by
  vi?: string | undefined;  // visualise - colour scheme
}
