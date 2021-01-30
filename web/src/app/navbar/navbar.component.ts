import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent implements OnInit {

  offCanvasMenuIsOpen: boolean = false;

  constructor(private router: Router) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.offCanvasMenuIsOpen = false;
      }
    });
  }

  ngOnInit(): void {
  }

  navigateToHomepage() {
    this.router.navigate(['/'], { queryParamsHandling: "merge" });
  }

  onToggleoffCanvasMenu() {
    this.offCanvasMenuIsOpen = !this.offCanvasMenuIsOpen;
  }

}
