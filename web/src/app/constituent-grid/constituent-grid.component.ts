import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ConstituentSnapshot} from "../interface/ConstituentSnapshot";
import {ActivatedRoute} from "@angular/router";
import {FilterQueryParams} from "../interface/FilterQueryParams";


@Component({
  selector: 'constituent-grid',
  templateUrl: './constituent-grid.component.html'
})
export class ConstituentGridComponent implements OnInit, OnChanges {

  queryParams: FilterQueryParams = <FilterQueryParams>{};

  @Input() snapshotData: ConstituentSnapshot[];
  snapshots: ConstituentSnapshot[];

  constructor(public route: ActivatedRoute) {
    this.snapshotData = [];
    this.snapshots = [];

    // Listen for changes to the query params.
    route.queryParams.subscribe(p => {
      this.queryParams = p;
    });
  }

  ngOnInit(): void {
    if (this.snapshotData) {
      this.snapshots = this.snapshotData;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.snapshots = this.snapshotData;
  }

  getVisualisationQueryParam(): string {
    if (this.queryParams.hasOwnProperty('vi') && this.queryParams['vi'] != null) {
      return this.queryParams['vi'];
    }
    return '';
  }

  getColourSchemeClass(value: number, colourSchemeBoundaries: number[]): string {
    if (value == null) { return '--0'; }

    let classString: string = '';
    for (const [i, boundary] of colourSchemeBoundaries.entries()) {
      if (value < boundary) {
        classString = '--' + i.toString();
        break;
      }
    }

    return classString;
  }

 /* Market cap statistics { q25: 15109095936, q50: 26098293760, q75: 55620502528, avg: 68807283035, min: 4172057600, max: 2215357710336 } */
  determineMarketCapClass(marketCap: number): string {
    return this.getColourSchemeClass(marketCap, [5000000000, 12500000000, 25000000000, 50000000000, 125000000000, 250000000000, 500000000000, 1000000000000, 2000000000000, 3000000000000]);
  }
  /* Short ratio statistics { q25: 1.88, q50: 2.52, q75: 3.44, avg: 3.06, min: 0.00, max: 17.25 } */
  determineShortRatioClass(ratio: number): string {
    return this.getColourSchemeClass(ratio, [0, 1.0, 1.5, 2.0, 2.5, 3.5, 5.0, 7.0, 10.0, 18.0]);
  }
 /* Short % of float statistics { q25: 0.011724999875, q50: 0.018, q75: 0.034100000500000005, avg: 0.036452964324308286, min: 0, max: 2.2642 } */
  determineShortFloatPercentageClass(percentage: number): string {
    return this.getColourSchemeClass(percentage, [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.5, 1.0, 2.3]);
  }
  /* Revenue per share statistics { q25: 17.80, q50: 29.29, q75: 57.05, avg: 364.91, min: 0.00, max: 153806 } */
  determineRevenuePerShareClass(rps: number): string {
    return this.getColourSchemeClass(rps, [5, 15, 25, 50, 100, 400, 4000, 40000, 100000, 160000]);
  }
  determineMarketSentimentClass(sentimentSlug: string): string {
    // @ts-ignore
    return {
      'strong_buy': '--strong-buy',
      'buy': '--buy',
      'overperform': '--overperform',
      'hold': '--hold',
      'underperform': '--underperform',
      'sell': '--sell',
      'strong_sell': '--strong-sell',
      'none': '--none'
    }[sentimentSlug];
  }

  getVisualisationPaletteClass(snapshot: ConstituentSnapshot): string {
    const classBase = 'constituent-grid__constituent-tile--'
    const visualisationQueryParam: string = this.getVisualisationQueryParam();

    let modifier: string = '';
    switch (visualisationQueryParam) {
      case 'ca':
        modifier = this.determineMarketCapClass(snapshot.financial.market_cap);
        break;
      case 'sh':
        modifier = this.determineShortRatioClass(snapshot.key_stats.short_ratio);
        break;
      case 'fl':
        modifier = this.determineShortFloatPercentageClass(snapshot.key_stats.short_percent_of_float);
        break;
      case 'rp':
        modifier = this.determineRevenuePerShareClass(snapshot.financial.revenue_per_share);
        break;
      case 'ms':
        modifier = this.determineMarketSentimentClass(snapshot.summary.recommendation);
        break;
    }
    return classBase + visualisationQueryParam + modifier;
  }

}
