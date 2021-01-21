import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConstituentGridComponent } from './constituent-grid/constituent-grid.component';
import { ConstituentGridFilterComponent } from './constituent-grid-filter/constituent-grid-filter.component';
import { ConstituentGridDataWrapperComponent } from './constituent-grid-data-wrapper/constituent-grid-data-wrapper.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    ConstituentGridComponent,
    ConstituentGridFilterComponent,
    ConstituentGridDataWrapperComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
