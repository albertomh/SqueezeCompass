import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ConstituentGridFilterQueryParams} from "../interface/ConstituentGridFilterQueryParams";

@Component({
  selector: 'constituent-grid-filter',
  templateUrl: './constituent-grid-filter.component.html',
  styleUrls: ['./constituent-grid-filter.component.scss']
})
export class ConstituentGridFilterComponent implements OnInit {
  queryParams: ConstituentGridFilterQueryParams = {};

  constructor(private router: Router, route: ActivatedRoute) {
    // Listen for changes to the query params.
    route.queryParams.subscribe(p => {
      this.queryParams = p;
    });
  }

  ngOnInit(): void {
  }

  clearQueryParams(): void {
    this.router.navigate(['/'], { queryParams: {} });
  }

  toggleOrder(order: string): void {
    this.router.navigate(['/'], { queryParams: { order: order } });
  }

}
