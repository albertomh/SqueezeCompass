import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'constituent-grid-filter',
  templateUrl: './constituent-grid-filter.component.html',
  styleUrls: ['./constituent-grid-filter.component.scss']
})
export class ConstituentGridFilterComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  clearQueryParams(): void {
    this.router.navigate(['/'], { queryParams: {} });
  }

  toggleOrder(order: string): void {
    this.router.navigate(['/'], { queryParams: { order: order } });
  }

}
