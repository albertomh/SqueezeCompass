import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

  readonly curYear: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }

}
