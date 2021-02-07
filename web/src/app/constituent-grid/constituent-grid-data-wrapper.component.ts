import { Component, OnInit } from '@angular/core';
import {ConstituentSnapshot} from "../interface/ConstituentSnapshot";
import {ActivatedRoute} from "@angular/router";
import {SortBy} from '../enum/FilterQueryParamValues';
import {FilterQueryParams} from "../interface/FilterQueryParams";
import {environment} from "../../environments/environment";
import {max, min} from "rxjs/operators";
import {mark} from "@angular/compiler-cli/src/ngtsc/perf/src/clock";


@Component({
  selector: 'constituent-grid-data-wrapper',
  templateUrl: './constituent-grid-data-wrapper.component.html',
  styleUrls: []
})
export class ConstituentGridDataWrapperComponent implements OnInit {

  private route: ActivatedRoute;
  originalSnapshots: ConstituentSnapshot[];  // Store original array as fetched from JSON.
  snapshots: ConstituentSnapshot[];  // Store transformations of originalSnapshots according to applied filters.
  filtersReturnNothing: boolean = false;

  constructor(route: ActivatedRoute) {
    this.route = route;
    this.originalSnapshots = [];
    this.snapshots = [];
  }

  ngOnInit(): void {
  fetch(environment.filePathForSnapshot)
    .then(response => response.json())
    .then(data => {
      this.originalSnapshots = data.data;
      this.snapshots = data.data;

      // Listen for changes to the query params.
      this.route.queryParams.subscribe(p => {
        this.onQueryParamsChange(p);
      });
    });
  }

  onQueryParamsChange(queryParams: FilterQueryParams): void {
    this.filtersReturnNothing = false;
    let resultSnapshots: ConstituentSnapshot[] = [];

    // Filter
    let sentimentSnapshots: ConstituentSnapshot[] = this.filterByMarketSentiment(queryParams.fms);
    let marketCapSnapshots: ConstituentSnapshot[] = this.filterByMarketCap(queryParams.fcp);
    // Find intersection of both filtered arrays of snapshots.
    resultSnapshots = sentimentSnapshots.filter(({ symbol: sy1 }) => marketCapSnapshots.some(({ symbol: sy2 }) => sy2 === sy1));
    // Sort
    resultSnapshots = this.sortAlphabetical(resultSnapshots, queryParams.so);

    this.filtersReturnNothing = resultSnapshots.length === 0;
    this.snapshots = resultSnapshots;
  }

// ----- FILTER ----------------------------------------------------------------
  filterByMarketSentiment(marketSentimentQueryValue?: string): ConstituentSnapshot[] {
    const sentimentMap: {[sentiment: string]: string[]} = {
      'b': ['strong_buy', 'buy', 'overperform'],
      'h': ['hold'],
      's': ['underperform', 'sell', 'strong_sell'],
    };

    if (marketSentimentQueryValue == null) { return []; }

    let sentiments: string[] = marketSentimentQueryValue.split(',');
    let sentimentSlugs: string[] = sentiments.reduce((acc: string[], s: string) => acc.concat(sentimentMap[s]), []);
    let filteredSnapshots = [...this.originalSnapshots].filter(snap => sentimentSlugs.includes(snap.summary.recommendation));
    return filteredSnapshots;
  }

  filterByMarketCap(marketCapQueryValue?: string): ConstituentSnapshot[] {
    /* Market cap statistics:
     * avg:    68 807 283 035
     * q25:    15 109 095 936
     * q50:    26 098 293 760
     * q75:    55 620 502 528
     * min:     4 172 057 600
     * max: 2 215 357 710 336
     */
    const marketCapMap: {[marketCap: string]: number[]} = {
      'lt': [0, 20000000000],
      'bt': [20000000000, 100000000000],
      'gt': [100000000000, 10000000000000],
    };

    if (marketCapQueryValue == null) { return []; }

    let marketCaps: string[] = marketCapQueryValue.split(',');
    let marketCapRanges: number[][] = marketCaps.map(capVal => marketCapMap[capVal]);

    let filteredSnapshots: ConstituentSnapshot[] = [];

    marketCapRanges.forEach(range => {
      let snapshotsWithinRange: ConstituentSnapshot[] = [...this.originalSnapshots].filter(snap => {
        let cap: number = snap.financial.market_cap;
        return range[0] <= cap && cap <= range[1];
      });
      filteredSnapshots.push(...snapshotsWithinRange);
    });

    return filteredSnapshots;
  }

// ----- SORT ------------------------------------------------------------------
  sortAlphabetical(snapshots: ConstituentSnapshot[], order?: string): ConstituentSnapshot[] {
    if (order != null) {
      let orderedSnapshots: ConstituentSnapshot[] = [...snapshots].sort((a: ConstituentSnapshot, b: ConstituentSnapshot) => a.symbol.localeCompare(b.symbol));
      if (order === SortBy[SortBy.al]) {
        return orderedSnapshots;
      } else if (order === SortBy[SortBy.re]) {
        return orderedSnapshots.reverse();
      }
    }
    return snapshots;
  }

// ----- VISUALISE -------------------------------------------------------------

}
