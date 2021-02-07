import { Component, OnInit } from '@angular/core';
import {Constituent} from "../interface/Constituent";
import {ActivatedRoute, Router} from "@angular/router";
import {ConstituentSnapshot} from "../interface/ConstituentSnapshot";
import {environment} from "../../environments/environment";


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
  objKeys = Object.keys;

  constructor(private router: Router, route: ActivatedRoute) {
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
      fetch(environment.filePathForSnapshot),
      fetch(environment.filePathForConstituents)

    ]).then(responses => {
      return Promise.all(responses.map(response => response.json()));  // Get a JSON object from each of the responses.

    }).then(data => {
      this.snapshots = data[0].data;
      this.selectedSnapshot = this.snapshots.filter(s => s.symbol === this.symbol)[0];
      this.constituents = data[1];
      this.selectedConstituent = this.constituents.filter(c => c.symbol === this.symbol)[0];

      if (typeof this.selectedConstituent === 'undefined') {
        this.router.navigate(['/404'], { queryParamsHandling: "merge" });
      }

    }).catch(function (error) {
      console.error(error);
    });
  }

}
