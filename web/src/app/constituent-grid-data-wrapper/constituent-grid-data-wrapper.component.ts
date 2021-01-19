import { Component, OnInit } from '@angular/core';
import {ConstituentSnapshot} from "../interface/ConstituentSnapshot";
import {ActivatedRoute} from "@angular/router";
import {ConstituentGridFilterQueryParams} from "../interface/ConstituentGridFilterQueryParams";

@Component({
  selector: 'constituent-grid-data-wrapper',
  templateUrl: './constituent-grid-data-wrapper.component.html'
})
export class ConstituentGridDataWrapperComponent implements OnInit {

  private route: ActivatedRoute;
  dataHasLoaded: boolean;
  originalSnapshots: ConstituentSnapshot[];  // Store original array as fetched from JSON.
  snapshots: ConstituentSnapshot[];  // Store transformations of originalSnapshots according to applied filters.

  constructor(route: ActivatedRoute) {
    this.route = route;
    this.dataHasLoaded = false;
    this.originalSnapshots = [];
    this.snapshots = [];
  }

  ngOnInit(): void {
  fetch('/assets/data/2021-01-31_snapshot.json')
    .then(response => response.json())
    .then(data => {
      this.originalSnapshots = data.data;
      this.snapshots = data.data;
      this.dataHasLoaded = true;

      // Listen for changes to the query params.
      this.route.queryParams.subscribe(p => {
        this.onQueryParamsChange(p);
      });
    });
  }

  onQueryParamsChange(queryParams: ConstituentGridFilterQueryParams): void {
    this.filterOrder(queryParams.order);
  }

  // ----- Filter methods
  filterOrder(order?: string) {
    if (order == null) {
      this.snapshots = this.originalSnapshots;
    } else {
      let orderedSnapshots: ConstituentSnapshot[] = [...this.originalSnapshots].sort((a: ConstituentSnapshot, b: ConstituentSnapshot) => a.symbol.localeCompare(b.symbol));
      if (order === 'alphabetical') {
        this.snapshots = orderedSnapshots;
      } else if (order === 'reverse') {
        this.snapshots = orderedSnapshots.reverse();
      }
    }
  }

}
