import { Component, OnInit } from '@angular/core';
import {Meta, Title} from "@angular/platform-browser";


@Component({
  selector: 'homepage',
  templateUrl: './homepage.component.html',
  styleUrls: []
})
export class HomepageComponent implements OnInit {

  constructor(private titleService: Title, private metaService: Meta) {
    let title: string = "SqueezeCompass";
    titleService.setTitle(title);
    metaService.updateTag({ property: 'og:title', content: title });
    metaService.updateTag({ property: 'og:url', content: 'https://www.albertomh.com/SqueezeCompass' });
  }

  ngOnInit(): void {
  }

}
