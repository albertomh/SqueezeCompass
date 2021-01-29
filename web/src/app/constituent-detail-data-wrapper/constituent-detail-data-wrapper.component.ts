import { Component, OnInit } from '@angular/core';
import {Constituent} from "../interface/Constituent";
import {ActivatedRoute} from "@angular/router";
import {ConstituentSnapshot} from "../interface/ConstituentSnapshot";


@Component({
  selector: 'constituent-detail-data-wrapper',
  templateUrl: './constituent-detail-data-wrapper.component.html'
})
export class ConstituentDetailDataWrapperComponent implements OnInit {

  snapshots: ConstituentSnapshot[];
  selectedSnapshot: ConstituentSnapshot;
  constituents: Constituent[];
  selectedConstituent: Constituent;
  symbol: string = "";

  constructor(route: ActivatedRoute) {
    this.snapshots = [];
    this.constituents = [];
    this.selectedSnapshot = <ConstituentSnapshot>{};
    this.selectedConstituent = <Constituent>{};

    let urlSymbol = route.snapshot.paramMap.get('symbol');
    if (urlSymbol !== null) {
      this.symbol = urlSymbol;
    }
  }

  ngOnInit(): void {
    Promise.all([
      fetch('/assets/data/2021-01-31_snapshot.json'),
      fetch('/assets/data/2021-02-01_constituents.json')
    ]).then(responses => {
      return Promise.all(responses.map(response => response.json()));  // Get a JSON object from each of the responses.
    }).then(data => {
      this.snapshots = data[0].data;
      this.selectedSnapshot = this.snapshots.filter(s => s.symbol === this.symbol)[0];
      this.constituents = data[1];
      this.selectedConstituent = this.constituents.filter(c => c.symbol === this.symbol)[0];
    }).catch(function (error) {
      console.log(error);
    });

    // TODO: show 404 if symbol not in this.constituents.
  }

}
