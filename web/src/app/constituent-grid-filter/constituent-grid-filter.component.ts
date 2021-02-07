import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FilterMarketCap, FilterSentiment, SortBy, Visualise} from '../enum/FilterQueryParamValues';
import {FilterQueryParams} from "../interface/FilterQueryParams";


@Component({
  selector: 'constituent-grid-filter',
  templateUrl: './constituent-grid-filter.component.html',
  styleUrls: ['./constituent-grid-filter.component.scss']
})
export class ConstituentGridFilterComponent implements OnInit {

  public FilterSentiment = FilterSentiment;
  public FilterMarketCap = FilterMarketCap;
  public SortBy = SortBy;
  public Visualise = Visualise;

  queryParams: FilterQueryParams = <FilterQueryParams>{};
  readonly defaultParams: FilterQueryParams = {
    fms: [FilterSentiment[FilterSentiment.s], FilterSentiment[FilterSentiment.h], FilterSentiment[FilterSentiment.b]].join(','),
    fcp: [FilterMarketCap[FilterMarketCap.lt], FilterMarketCap[FilterMarketCap.bt], FilterMarketCap[FilterMarketCap.gt]].join(','),
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

  // --- Filter metacontrols: open/close tray, clear filters. ------------------
  onToggleFilterTrayOpen() {
    this.filterTrayOpen = !this.filterTrayOpen;
  }

  resetToDefaultFilters(): void {
    this.router.navigate(['/'], { queryParams: this.defaultParams, queryParamsHandling: "merge" });
  }

  // --- Filter, Sort, and Visualise Query Parameters --------------------------
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
  filterBy(categoryQueryStringKey: string, filterOption: FilterSentiment | FilterMarketCap): void {
    let filterValue: string = '';
    switch (categoryQueryStringKey) {
      case 'fms':
        filterValue = FilterSentiment[filterOption];
        break;
      case 'fcp':
        filterValue = FilterMarketCap[filterOption];
        break;
    }

    if (filterValue === '') { return; }  // Exit if no filterValue is assigned.

    let categoryQueryString: string = <string>this.route.snapshot.queryParamMap.get(categoryQueryStringKey);
    if (categoryQueryString === null) {
      // If no option is selected for this option, apply the one that was clicked.
      categoryQueryString = filterValue;
    } else {
      let categoryQueryParams: string[] = categoryQueryString.split(',');  // Get the currently applied filter options.
      if (categoryQueryParams.includes(filterValue)) {
        // If the clicked filter option was already applied, remove it.
        categoryQueryParams = categoryQueryParams.filter(qp => qp !== filterValue);
        categoryQueryString = categoryQueryParams.join(',');
      } else {
        // Add a filter option that had not yet been applied.
        categoryQueryString += ',' + filterValue;
      }
    }

    let queryParams: {[index: string]: string|null} = {};
    if (categoryQueryString.length === 0) {
      queryParams[categoryQueryStringKey] = null;
    } else {
      queryParams[categoryQueryStringKey] = categoryQueryString;
    }
    this.router.navigate(['/'], { queryParams: queryParams, queryParamsHandling: "merge" })
  }

  filterByMarketSentiment(sentiment: FilterSentiment): void {
    this.filterBy('fms', sentiment);
  }

  filterByMarketCap(marketCap: FilterMarketCap): void {
    this.filterBy('fcp', marketCap);
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
