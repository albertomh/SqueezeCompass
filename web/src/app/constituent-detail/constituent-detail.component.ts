import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Constituent} from "../interface/Constituent";
import {ConstituentSnapshot} from "../interface/ConstituentSnapshot";
import {Meta, Title} from "@angular/platform-browser";


@Component({
  selector: 'constituent-detail',
  templateUrl: './constituent-detail.component.html',
  styleUrls: ['./constituent-detail.component.scss']
})
export class ConstituentDetailComponent implements OnInit, OnChanges {

  @Input() snapshotData: ConstituentSnapshot;
  snapshot: ConstituentSnapshot;
  @Input() constituentData: Constituent;
  constituent: Constituent;

  readonly gicsSectorIcons: {[sector: string]: [icon: string, color: string]} = {
    "Communication Services": ['bi-broadcast-pin', '--communication'],
    "Consumer Discretionary": ['bi-cart4', '--discretionary'],
    "Consumer Staples": ['bi-cup-straw', '--staples'],
    "Energy": ['bi-lightning-fill', '--energy'],
    "Financials": ['bi-graph-up', '--financials'],
    "Health Care": ['bi-asterisk', '--health'],
    "Industrials": ['bi-building', '--industrials'],
    "Information Technology": ['bi-cpu-fill', '--it'],
    "Materials": ['bi-bucket-fill', '--materials'],
    "Real Estate": ['bi-house-fill', '--realestate'],
    "Utilities": ['bi-lightbulb-fill', '--utilities'],
  };

  readonly sentimentsHumanized: {[slug: string]: string} = {
    "strong_buy": 'Strong buy',
    "buy": 'Buy',
    "overperform": 'Overperform',
    "hold": 'Hold',
    "none": 'None',
    "underperform": 'Underperform',
    "sell": 'Sell',
    "strong_sell": 'Strong sell',
  };
  readonly sentimentsClasses: {[slug: string]: string} = {
    "strong_buy": '--strong-buy',
    "buy": '--buy',
    "overperform": '--overperform',
    "hold": '--hold',
    "none": '--none',
    "underperform": '--underperform',
    "sell": '--sell',
    "strong_sell": '--strong-sell',
  };

  readonly million = 1000000;
  readonly billion = 1000000000;
  readonly trillion = 1000000000000;
  abs = Math.abs;

  constructor(private titleService: Title, private metaService: Meta) {
    this.snapshotData = <ConstituentSnapshot>{};
    this.snapshot = <ConstituentSnapshot>{};
    this.constituentData = <Constituent>{};
    this.constituent = <Constituent>{};
  }

  ngOnInit(): void {
    if (Object.keys(this.snapshotData).length > 0 && Object.keys(this.constituentData).length > 0) {
      this.snapshot = this.snapshotData;
      this.constituent = this.constituentData;

      let title: string = this.constituent.symbol + ': ' + this.constituent.name + ' | ' + this.titleService.getTitle();
      this.titleService.setTitle(title);
      this.metaService.updateTag({ property: 'og:title', content: title });
      this.metaService.updateTag({ property: 'og:url', content: 'https://www.albertomh.com/SqueezeCompass/' + this.constituent.symbol });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.snapshot = this.snapshotData;
    this.constituent = this.constituentData;
  }

}
