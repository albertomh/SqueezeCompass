import { Component, OnInit } from '@angular/core';
import {ConstituentSnapshot} from "../interface/ConstituentSnapshot";
import {ActivatedRoute} from "@angular/router";
import {SortBy} from '../enum/FilterQueryParamValues';
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
    let resultSnapshots: ConstituentSnapshot[] = this.originalSnapshots;

    // Filter
    resultSnapshots = this.applyMarketSentimentFilter(resultSnapshots, queryParams.fms);
    // Sort
    resultSnapshots = this.applyAlphabeticalOrderFilter(resultSnapshots, queryParams.so);

    this.filtersReturnNothing = resultSnapshots.length === 0;
    this.snapshots = resultSnapshots;
  }

  // ----- Filter methods
  applyAlphabeticalOrderFilter(snapshots: ConstituentSnapshot[], order?: string): ConstituentSnapshot[] {
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

  applyMarketSentimentFilter(snapshots: ConstituentSnapshot[], marketSentiment?: string) {
    const sentimentMap: {[sentiment: string]: string[]} = {
      'b': ['strong_buy', 'buy', 'overperform'],
      'h': ['hold'],
      's': ['underperform', 'sell', 'strong_sell'],
    };

    if (marketSentiment == null) {
      return [];
    }

    let sentiments: string[] = marketSentiment.split(',');
    let sentimentSlugs: string[] = sentiments.reduce((acc: string[], s: string) => acc.concat(sentimentMap[s]), []);
    let filteredSnapshots = [...snapshots].filter(snap => sentimentSlugs.includes(snap.summary.recommendation));
    return filteredSnapshots;
  }

}
