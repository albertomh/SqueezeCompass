import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FilterMarketCap, FilterSentiment, FilterTrayOpen, SortBy, Visualise} from '../enum/FilterQueryParamValues';
import {FilterQueryParams} from "../interface/FilterQueryParams";


@Component({
  selector: 'constituent-grid-filter',
  templateUrl: './constituent-grid-filter.component.html',
  styleUrls: ['./constituent-grid-filter.component.scss']
})
export class ConstituentGridFilterComponent implements OnInit {

  public FilterTrayOpen = FilterTrayOpen;
  public FilterSentiment = FilterSentiment;
  public FilterMarketCap = FilterMarketCap;
  public SortBy = SortBy;
  public Visualise = Visualise;

  curQueryParams: FilterQueryParams = <FilterQueryParams>{};
  readonly defaultQueryParams: FilterQueryParams = {
    ft: FilterTrayOpen[FilterTrayOpen.c],
    fms: [FilterSentiment[FilterSentiment.s], FilterSentiment[FilterSentiment.h], FilterSentiment[FilterSentiment.b]].join(','),
    fcp: [FilterMarketCap[FilterMarketCap.lt], FilterMarketCap[FilterMarketCap.bt], FilterMarketCap[FilterMarketCap.gt]].join(','),
    so: SortBy[SortBy.al],
    vi: Visualise[Visualise.ms],
  }

  inQueryParams = (key: string, val: string): boolean => {
    if (this.curQueryParams.hasOwnProperty(key) && typeof this.curQueryParams[key] !== 'undefined') {
      // @ts-ignore
      return this.curQueryParams[key].includes(val);
    }
    return false;
  };

  curQueryParamsAreDefault(): boolean {
    // Check whether the filter query params are currently set to the default values.
    // Ignore parameter `ft` since we don't want to enable / disable the
    // 'Reset filters' button each time the filtertray is opened/closed.
    let defaultQueryParamsWithoutFT = {...this.defaultQueryParams};
    let curQueryParamsWithoutFT = {...this.curQueryParams};
    delete defaultQueryParamsWithoutFT.ft;
    delete curQueryParamsWithoutFT.ft;

    let defaultQueryParamKeys = Object.keys(defaultQueryParamsWithoutFT).sort();
    let defaultQueryParamValues = Object.values(defaultQueryParamsWithoutFT).sort();
    let curQueryParamKeys = Object.keys(curQueryParamsWithoutFT).sort();
    let curQueryParamValues = Object.values(curQueryParamsWithoutFT).sort();

    let keysAreEqual = JSON.stringify(curQueryParamKeys) === JSON.stringify(defaultQueryParamKeys);
    let valuesAreEqual = JSON.stringify(curQueryParamValues) === JSON.stringify(defaultQueryParamValues);

    return keysAreEqual && valuesAreEqual;
  }

  typeOf = (val: any): string => typeof val;

  constructor(public router: Router, public route: ActivatedRoute) {
    // Listen for changes to the query params.
    route.queryParams.subscribe(p => {
      this.curQueryParams = p;
    });

    let queryParamKeys = Object.keys(this.curQueryParams);
    if (queryParamKeys.length === 0 || !this.curQueryParamsAreDefault()) {
      this.resetToDefaultFilters();
    }
  }

  ngOnInit(): void {
  }

  // --- Filter metacontrols: open/close tray, clear filters. ------------------
  onToggleFilterTrayOpen() {
    let filterStatus: string;

    if (this.curQueryParams.ft === FilterTrayOpen[FilterTrayOpen.c]) {
      filterStatus = FilterTrayOpen[FilterTrayOpen.o];
    } else {
      filterStatus = FilterTrayOpen[FilterTrayOpen.c];
    }

    this.router.navigate(['/'], { queryParams: { ft: filterStatus }, queryParamsHandling: "merge" });
  }

  resetToDefaultFilters(): void {
    let defaultQueryParams = this.defaultQueryParams;
    if (this.curQueryParams.ft != null) {
      defaultQueryParams.ft = this.curQueryParams.ft;
    }
    this.router.navigate(['/'], { queryParams: defaultQueryParams, queryParamsHandling: "merge" });
  }

  // --- Filter, Sort, and Visualise Query Parameters --------------------------
  /*
  * FILTER:
  * fms: market sentiment [s: sell, h: hold, b: buy]
  * fcp: market cap [lt: <20bn, bt: 20-100bn, gt: >100bn]
  *
  * SORT:
  * so: [al: alphabetical | ca: market cap | sh: short ratio | fl: short % of float]
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

    let newQueryParams: {[index: string]: string|null} = {};
    if (categoryQueryString.length === 0) {
      newQueryParams[categoryQueryStringKey] = null;
    } else {
      newQueryParams[categoryQueryStringKey] = categoryQueryString;
    }
    this.router.navigate(['/'], { queryParams: newQueryParams, queryParamsHandling: "merge" })
  }

  filterByMarketSentiment(sentiment: FilterSentiment): void {
    this.filterBy('fms', sentiment);
  }

  filterByMarketCap(marketCap: FilterMarketCap): void {
    this.filterBy('fcp', marketCap);
  }

// ----- SORT ------------------------------------------------------------------
  sortByUpdateRoute(order: SortBy) {
    this.router.navigate(['/'], { queryParams: { so: SortBy[order] }, queryParamsHandling: "merge" });
  }

// ----- VISUALISE -------------------------------------------------------------
  visualiseByUpdateRoute(scheme: Visualise) {
    this.router.navigate(['/'], { queryParams: { vi: Visualise[scheme] }, queryParamsHandling: "merge" });
  }

}
