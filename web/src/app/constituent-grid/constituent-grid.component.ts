import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ConstituentSnapshot} from "../interface/ConstituentSnapshot";

@Component({
  selector: 'constituent-grid',
  templateUrl: './constituent-grid.component.html',
  styleUrls: ['./constituent-grid.component.scss']
})
export class ConstituentGridComponent implements OnInit, OnChanges {
  @Input() data: ConstituentSnapshot[];
  snapshots: ConstituentSnapshot[];

  readonly recommendationClasses: { [className: string]: string } = {
    'strong_buy': 'constituent-grid__constituent-tile--strong-buy',
    'buy': 'constituent-grid__constituent-tile--buy',
    'overperform': 'constituent-grid__constituent-tile--overperform',
    'hold': 'constituent-grid__constituent-tile--hold',
    'none': 'constituent-grid__constituent-tile--hold',
    'underperform': 'constituent-grid__constituent-tile--underperform',
    'sell': 'constituent-grid__constituent-tile--sell',
    'strong_sell': 'constituent-grid__constituent-tile--strong-sell'
  };

  constructor() {
    this.data = [];
    this.snapshots = [];
  }

  ngOnInit(): void {
    if (this.data) {
      this.snapshots = this.data;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.snapshots = this.data;
    console.log(this.data);
  }

}
