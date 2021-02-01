import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { AlphabeticalOrder, MarketSentiment } from '../enum/FilterQueryParameters';
import {FilterQueryParams} from "../interface/FilterQueryParams";


@Component({
  selector: 'constituent-grid-filter',
  templateUrl: './constituent-grid-filter.component.html',
  styleUrls: ['./constituent-grid-filter.component.scss']
})
export class ConstituentGridFilterComponent implements OnInit {

  public AlphabeticalOrder = AlphabeticalOrder;
  public MarketSentiment = MarketSentiment;

  filterTrayOpen: boolean = false;
  queryParams: FilterQueryParams = {};
  typeOf = (val: any) => typeof val;

  constructor(public router: Router, public route: ActivatedRoute) {
    // Listen for changes to the query params.
    route.queryParams.subscribe(p => {
      this.queryParams = p;
    });
  }

  ngOnInit(): void {
  }

  // --- Filter metacontrols: open/close tray, clear filters.
  onToggleFilterTrayOpen() {
    this.filterTrayOpen = !this.filterTrayOpen;
  }

  resetFilters(): void {
    // Clear query params.
    this.router.navigate(['/'], { queryParams: {} });
  }

  // --- Filters
  /*
  * filter query param key: meaning ['query param value': meaning <|,> ... ]
  *
  *  o:  alphabetical order ['a': alphabetical | 'r': reverse]
  * ms: market sentiment   ['s': sell, 'h': hold, 'b': buy]
  *
  */
  toggleAlphabeticalOrder(order: AlphabeticalOrder): void {
    let alphaOrderQueryString: string = <string>this.route.snapshot.queryParamMap.get('o');

    if (alphaOrderQueryString === null) {
      alphaOrderQueryString = AlphabeticalOrder[AlphabeticalOrder.a];
    }
    if (AlphabeticalOrder[order] === alphaOrderQueryString) {
      return;
    }

    let newQueryValue: AlphabeticalOrder;
    if (alphaOrderQueryString === AlphabeticalOrder[AlphabeticalOrder.a]) {
      newQueryValue = AlphabeticalOrder.r;
    } else {
      newQueryValue = AlphabeticalOrder.a;
    }

    this.router.navigate(['/'], { queryParams: { o: AlphabeticalOrder[newQueryValue] }, queryParamsHandling: "merge" });
  }

  /*toggleMarketSentiment(sentiment: string): void {
    let msQueryString: string = <string>this.route.snapshot.queryParamMap.get('ms');
    if (msQueryString !== null) {

    }
    //let msQueryParams: string[] = Array.from();

  }*/

}
