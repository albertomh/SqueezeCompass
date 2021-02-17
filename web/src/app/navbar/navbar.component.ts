import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent implements OnInit {

  url: string = '';
  offCanvasMenuIsOpen: boolean = false;

  constructor(private router: Router) {
    router.events.subscribe((val) => {
      this.url = router.url.split('?')[0];

      if (val instanceof NavigationEnd) {
        this.offCanvasMenuIsOpen = false;
      }
    });
  }

  ngOnInit(): void {
  }

  navigateToHomepage() {
    this.router.navigate(['/'], { queryParamsHandling: "merge", replaceUrl: true });
  }

  onToggleoffCanvasMenu() {
    this.offCanvasMenuIsOpen = !this.offCanvasMenuIsOpen;
  }

}
