import { Component, OnInit } from '@angular/core';
import {ConstituentSnapshot} from "../interface/ConstituentSnapshot";
import {ActivatedRoute} from "@angular/router";
import {ConstituentGridFilterQueryParams} from "../interface/ConstituentGridFilterQueryParams";

@Component({
  selector: 'constituent-grid',
  templateUrl: './constituent-grid.component.html',
  styleUrls: ['./constituent-grid.component.scss'],
  host: {class: 'constituent-grid'}
})
export class ConstituentGridComponent implements OnInit {

  originalSnapshots: ConstituentSnapshot[];  // Store original array.
  snapshots: ConstituentSnapshot[];  // Transform originalSnapshots according to applied filters.
  readonly recommendationClasses: { [className: string]: string } = {
    'strong_buy': 'constituent-grid__constituent-square--strong-buy',
    'buy': 'constituent-grid__constituent-square--buy',
    'overperform': 'constituent-grid__constituent-square--overperform',
    'hold': 'constituent-grid__constituent-square--hold',
    'none': 'constituent-grid__constituent-square--hold',
    'underperform': 'constituent-grid__constituent-square--underperform',
    'sell': 'constituent-grid__constituent-square--sell',
    'strong_sell': 'constituent-grid__constituent-square--strong-sell'
  };

  constructor(route: ActivatedRoute) {
    this.originalSnapshots = [];
    this.snapshots = [];

    // Listen for changes to the query params.
    route.queryParams.subscribe(p => {
      this.onQueryParamsChange(p);
    });
  }

  ngOnInit(): void {
  fetch('/assets/data/2021-01-31_snapshot.json')
    .then(response => response.json())
    .then(data => {
      this.originalSnapshots = data.data;
      this.snapshots = data.data;
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
      let orderedSnapshots: ConstituentSnapshot[] = [...this.snapshots].sort((a, b) => a.symbol.localeCompare(b.symbol));
      if (order === 'alphabetical') {
        this.snapshots = orderedSnapshots;
      } else if (order === 'reverse') {
        this.snapshots = orderedSnapshots.reverse();
      }
    }

  }

}
