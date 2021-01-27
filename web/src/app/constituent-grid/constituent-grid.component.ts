import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ConstituentSnapshot} from "../interface/ConstituentSnapshot";
import {Router} from "@angular/router";

@Component({
  selector: 'constituent-grid',
  templateUrl: './constituent-grid.component.html',
  styleUrls: ['./constituent-grid.component.scss']
})
export class ConstituentGridComponent implements OnInit, OnChanges {

  @Input() snapshotData: ConstituentSnapshot[];
  snapshots: ConstituentSnapshot[];

  readonly recommendationClasses: { [className: string]: string } = {
    'strong_buy': '--strong-buy',
    'buy': '--buy',
    'overperform': '--overperform',
    'hold': '--hold',
    'underperform': '--underperform',
    'sell': '--sell',
    'strong_sell': '--strong-sell',
    'none': '--none'
  };

  constructor(private router: Router) {
    this.snapshotData = [];
    this.snapshots = [];
  }

  ngOnInit(): void {
    if (this.snapshotData) {
      this.snapshots = this.snapshotData;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.snapshots = this.snapshotData;
  }

  onConstituentTileClick(symbol: string) {
    this.router.navigate([`/${symbol}`], { queryParamsHandling: "merge" });
  }

}
