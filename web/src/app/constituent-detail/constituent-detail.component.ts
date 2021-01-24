import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-constituent-detail',
  templateUrl: './constituent-detail.component.html',
  styleUrls: ['./constituent-detail.component.scss']
})
export class ConstituentDetailComponent implements OnInit {

  symbol: string = "";

  constructor(private router: Router, route: ActivatedRoute) {
    let urlSymbol = route.snapshot.paramMap.get('symbol');
    if (urlSymbol !== null) {
      this.symbol = urlSymbol;
    }
  }

  ngOnInit(): void {
  }

  onClickBackLink() {
    this.router.navigate(['/'], { queryParamsHandling: "merge" });
  }

}
