import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Constituent} from "../interface/Constituent";


@Component({
  selector: 'constituent-detail',
  templateUrl: './constituent-detail.component.html',
  styleUrls: ['./constituent-detail.component.scss']
})
export class ConstituentDetailComponent implements OnInit, OnChanges {

  @Input() constituentData: Constituent;
  constituent: Constituent;

  readonly gicsSectorIcons: {[sector: string]: [icon: string, color: string]} = {
    "Communication Services": ['bi-broadcast-pin', '--gics-communication'],
    "Consumer Discretionary": ['bi-cart4', '--gics-discretionary'],
    "Consumer Staples": ['bi-cup-straw', '--gics-staples'],
    "Energy": ['bi-lightning-fill', '--gics-energy'],
    "Financials": ['bi-graph-up', '--gics-financials'],
    "Health Care": ['bi-asterisk', '--gics-health'],
    "Industrials": ['bi-building', '--gics-industrials'],
    "Information Technology": ['bi-cpu-fill', '--gics-it'],
    "Materials": ['bi-bucket-fill', '--gics-materials'],
    "Real Estate": ['bi-house-fill', '--gics-realestate'],
    "Utilities": ['bi-lightbulb-fill', '--gics-utilities'],
  };

  constructor(private router: Router) {
    this.constituentData = {symbol: "", name: "", gics_sector: "", "gics_sub-industry": "", added: "", founded: ""};
    this.constituent = {symbol: "", name: "", gics_sector: "", "gics_sub-industry": "", added: "", founded: ""};
  }

  ngOnInit(): void {
    if (this.constituentData.symbol !== "") {
      this.constituent = this.constituentData;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.constituent = this.constituentData;
  }

  onClickBackLink() {
    this.router.navigate(['/'], { queryParamsHandling: "merge" });
  }

}
