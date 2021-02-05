import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Visualise, FilterSentiment, SortBy, FilterCap} from '../enum/FilterQueryParamValues';
import {FilterQueryParams} from "../interface/FilterQueryParams";


@Component({
  selector: 'constituent-grid-filter',
  templateUrl: './constituent-grid-filter.component.html',
  styleUrls: ['./constituent-grid-filter.component.scss']
})
export class ConstituentGridFilterComponent implements OnInit {

  public FilterSentiment = FilterSentiment;
  public FilterCap = FilterCap;
  public SortBy = SortBy;
  public Visualise = Visualise;

  queryParams: FilterQueryParams = <FilterQueryParams>{};
  readonly defaultParams: FilterQueryParams = {
    fms: [FilterSentiment[FilterSentiment.s], FilterSentiment[FilterSentiment.h], FilterSentiment[FilterSentiment.b]].join(','),
    fcp: [FilterCap[FilterCap.lt], FilterCap[FilterCap.bt], FilterCap[FilterCap.gt]].join(','),
    so: SortBy[SortBy.al],
    vi: Visualise[Visualise.ms],
  }

  inQueryParams = (key: string, val: string): boolean => {
    if (typeof this.queryParams[key] !== 'undefined') {
      // @ts-ignore
      return this.queryParams[key].includes(val);
    }
    return false;
  };

  typeOf = (val: any): string => typeof val;

  filterTrayOpen: boolean = false;

  constructor(public router: Router, public route: ActivatedRoute) {
    this.resetToDefaultFilters();

    // Listen for changes to the query params.
    route.queryParams.subscribe(p => {
      this.queryParams = p;
    });
  }

  ngOnInit(): void {
  }

  // --- Filter metacontrols: open/close tray, clear filters.
  onToggleFilterTrayOpen() {
    this.filterTrayOpen = !this.filterTrayOpen;
  }

  resetToDefaultFilters(): void {
    this.router.navigate(['/'], { queryParams: this.defaultParams, queryParamsHandling: "merge" });
  }

  // --- Filter, Sort, and Visualise Query Parameters
  /*
  * FILTER:
  * fms: market sentiment [s: sell, h: hold, b: buy]
  *
  * SORT:
  * so: [al: alphabetical | re: reverse]
  *
  * VISUALISE - COLOUR SCHEME:
  * vi: [ms: market sentiment | ca: market cap | sh: short interest | gi: GICS sector]
  */

// ----- FILTER ----------------------------------------------------------------
  filterByMarketSentiment(sentiment: FilterSentiment): void {
    let msQueryString: string = <string>this.route.snapshot.queryParamMap.get('fms');

    if (msQueryString === null) {
      // If no ms filter is applied, apply the one that was clicked.
      msQueryString = FilterSentiment[sentiment];
    } else {
      let msQueryParams: string[] = msQueryString.split(',');  // Get the currently applied ms filter.
      if (msQueryParams.includes(FilterSentiment[sentiment])) {
        // If the clicked filter was already applied, remove it.
        msQueryParams = msQueryParams.filter(item => item !== FilterSentiment[sentiment]);
        msQueryString = msQueryParams.join(',');
      } else {
        msQueryString += ',' + FilterSentiment[sentiment];  // Add the clicked filter.
      }
    }

    if (msQueryString.length > 0) {
      this.router.navigate(['/'], { queryParams: { fms: msQueryString }, queryParamsHandling: "merge" });
      return;
    }
    this.router.navigate(['/'], { queryParams: { fms: null }, queryParamsHandling: "merge" });
  }

  filterByMarketCap(cap: FilterCap): void {
    // TODO: implement by creating generic checkbox filter handler and using it to replacing filterByMarketSentiment too.
  }

// ----- SORT ------------------------------------------------------------------
  orderAlphabetically(order: SortBy): void {
    let alphaSortQueryString: string = <string>this.route.snapshot.queryParamMap.get('so');

    if (alphaSortQueryString === null) {
      alphaSortQueryString = SortBy[SortBy.al];
    }
    if (SortBy[order] === alphaSortQueryString) {
      return;
    }

    let newQueryValue: SortBy;
    if (alphaSortQueryString === SortBy[SortBy.al]) {
      newQueryValue = SortBy.re;
    } else {
      newQueryValue = SortBy.al;
    }

    this.router.navigate(['/'], { queryParams: { so: SortBy[newQueryValue] }, queryParamsHandling: "merge" });
  }

  sortByUpdateRoute(order: SortBy) {
    this.router.navigate(['/'], { queryParams: { so: SortBy[order] }, queryParamsHandling: "merge" });
  }

// ----- VISUALISE -------------------------------------------------------------
  visualiseByUpdateRoute(scheme: Visualise) {
    this.router.navigate(['/'], { queryParams: { vi: Visualise[scheme] }, queryParamsHandling: "merge" });
  }

}
