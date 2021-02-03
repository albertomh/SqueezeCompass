import { Component, OnInit } from '@angular/core';
import {ConstituentSnapshot} from "../interface/ConstituentSnapshot";
import {ActivatedRoute} from "@angular/router";
import { AlphabeticalOrder, MarketSentiment } from '../enum/FilterQueryParamValues';
import {FilterQueryParams} from "../interface/FilterQueryParams";
import {environment} from "../../environments/environment";
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
    let filteredSnapshots: ConstituentSnapshot[] = this.originalSnapshots;

    if (Object.keys(queryParams).length === 0) {
      filteredSnapshots = this.originalSnapshots;
    } else {
      filteredSnapshots = this.applyAlphabeticalOrderFilter(filteredSnapshots, queryParams.o);
      filteredSnapshots = this.applyMarketSentimentFilter(filteredSnapshots, queryParams.ms);
    }

    this.snapshots = filteredSnapshots;
  }

  // ----- Filter methods
  applyAlphabeticalOrderFilter(snapshots: ConstituentSnapshot[], order?: string): ConstituentSnapshot[] {
    if (order != null) {
      let orderedSnapshots: ConstituentSnapshot[] = [...snapshots].sort((a: ConstituentSnapshot, b: ConstituentSnapshot) => a.symbol.localeCompare(b.symbol));
      if (order === AlphabeticalOrder[AlphabeticalOrder.a]) {
        return orderedSnapshots;
      } else if (order === AlphabeticalOrder[AlphabeticalOrder.r]) {
        return orderedSnapshots.reverse();
      }
    }
    return snapshots;
  }

  applyMarketSentimentFilter(snapshots: ConstituentSnapshot[], marketSentiment?: string) {
    const sentimentMap: {[sentiment: string]: string[]} = {
      'b': ['strong_buy', 'buy', 'overperform'],
      'h': ['hold'],
      's': ['underperform', 'sell', 'strong_sell'],
    };

    if (marketSentiment != null) {
      let sentiments: string[] = marketSentiment.split(',');
      let sentimentSlugs: string[] = sentiments.reduce((acc: string[], s: string) => acc.concat(sentimentMap[s]), []);
      let filteredSnapshots = [...snapshots].filter(snap => sentimentSlugs.includes(snap.summary.recommendation));
      return filteredSnapshots;
    }
    return snapshots;
  }

}
