import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent implements OnInit {

  offCanvasMenuIsOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleoffCanvasMenu() {
    this.offCanvasMenuIsOpen = !this.offCanvasMenuIsOpen;
  }

}
