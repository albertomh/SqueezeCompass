import { Component, OnInit } from '@angular/core';
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'about',
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {

  constructor(private titleService: Title, private metaService: Meta) {
    let title: string = 'About | ' + titleService.getTitle();
    titleService.setTitle(title);
    metaService.updateTag({ property: 'og:title', content: title });
    metaService.updateTag({ property: 'og:url', content: 'https://www.albertomh.com/SqueezeCompass/about' });
  }

  ngOnInit(): void {
  }

}
