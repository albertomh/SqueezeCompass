import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ConstituentGridFilterQueryParams} from "../interface/ConstituentGridFilterQueryParams";


@Component({
  selector: 'constituent-grid-filter',
  templateUrl: './constituent-grid-filter.component.html',
  styleUrls: []
})
export class ConstituentGridFilterComponent implements OnInit {
  filterTrayOpen: boolean = false;
  queryParams: ConstituentGridFilterQueryParams = {};

  constructor(private router: Router, route: ActivatedRoute) {
    // Listen for changes to the query params.
    route.queryParams.subscribe(p => {
      this.queryParams = p;
    });
  }

  ngOnInit(): void {
  }

  onToggleFilterTrayOpen() {
    this.filterTrayOpen = !this.filterTrayOpen;
  }

  resetFilters(): void {
    // Clear query params.
    this.router.navigate(['/'], { queryParams: {} });
  }

  toggleOrder(order: string): void {
    this.router.navigate(['/'], { queryParams: { order: order } });
  }

}
