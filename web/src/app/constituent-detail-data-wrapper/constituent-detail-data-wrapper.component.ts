import { Component, OnInit } from '@angular/core';
import {Constituent} from "../interface/Constituent";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'constituent-detail-data-wrapper',
  templateUrl: './constituent-detail-data-wrapper.component.html',
  styleUrls: ['./constituent-detail-data-wrapper.component.scss']
})
export class ConstituentDetailDataWrapperComponent implements OnInit {

  constituents: Constituent[];
  selectedConstituent: Constituent;
  symbol: string = "";

  constructor(route: ActivatedRoute) {
    this.constituents = [];
    this.selectedConstituent = {symbol: "", name: "", gics_sector: "", "gics_sub-industry": "", added: "", founded: ""};

    let urlSymbol = route.snapshot.paramMap.get('symbol');
    if (urlSymbol !== null) {
      this.symbol = urlSymbol;
    }
  }

  ngOnInit(): void {
    fetch('/assets/data/2021-02-01_constituents.json')
    .then(response => response.json())
    .then(data => {
      this.constituents = data;
      this.selectedConstituent = this.constituents.filter(c => c.symbol === this.symbol)[0];
    });

    // TODO: show 404 if symbol not in this.constituents.
  }

}
