import { Component, OnInit } from '@angular/core';
import {ConstituentSnapshot} from "../interface/ConstituentSnapshot";
import {ActivatedRoute} from "@angular/router";
import {FilterQueryParams} from "../interface/FilterQueryParams";
import {environment} from "../../environments/environment";


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
    let filteredSnapshots: ConstituentSnapshot[] = [];
    let orderedSnapshots: ConstituentSnapshot[] = [];

    // Filter
    let sentimentSnapshots: ConstituentSnapshot[] = this.filterByMarketSentiment(queryParams.fms);
    let marketCapSnapshots: ConstituentSnapshot[] = this.filterByMarketCap(queryParams.fcp);
    // Find intersection of both filtered arrays of snapshots.
    filteredSnapshots = sentimentSnapshots.filter(({ symbol: sy1 }) => marketCapSnapshots.some(({ symbol: sy2 }) => sy2 === sy1));
    // Sort
    switch (queryParams.so) {
      case 'ca':
        orderedSnapshots = this.sortByMarketCap(filteredSnapshots);
        break;
      case 'sh':
        orderedSnapshots = this.sortByShortRatio(filteredSnapshots);
        break;
      case 'fl':
        orderedSnapshots = this.sortByShortPercentageOfFloat(filteredSnapshots);
        break;
      case 'al':
      default:
        orderedSnapshots = this.sortAlphabetical(filteredSnapshots);
        break;
    }

    this.filtersReturnNothing = orderedSnapshots.length === 0;
    this.snapshots = orderedSnapshots;
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
  sortAlphabetical(snapshots: ConstituentSnapshot[]): ConstituentSnapshot[] {
    return [...snapshots].sort((a: ConstituentSnapshot, b: ConstituentSnapshot) => a.symbol.localeCompare(b.symbol));
  }

  sortByMarketCap(snapshots: ConstituentSnapshot[]): ConstituentSnapshot[] {
    return [...snapshots].sort((a: ConstituentSnapshot, b: ConstituentSnapshot) => b.financial.market_cap - a.financial.market_cap);
  }

  sortByShortRatio(snapshots: ConstituentSnapshot[]): ConstituentSnapshot[] {
    return [...snapshots].sort((a: ConstituentSnapshot, b: ConstituentSnapshot) => b.key_stats.short_ratio - a.key_stats.short_ratio);
  }

  sortByShortPercentageOfFloat(snapshots: ConstituentSnapshot[]): ConstituentSnapshot[] {
    return [...snapshots].sort((a: ConstituentSnapshot, b: ConstituentSnapshot) => b.key_stats.short_percent_of_float - a.key_stats.short_percent_of_float);
  }

// ----- VISUALISE -------------------------------------------------------------

}
