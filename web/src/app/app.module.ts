import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ConstituentGridFilterComponent } from './constituent-grid-filter/constituent-grid-filter.component';
import { ConstituentGridDataWrapperComponent } from './constituent-grid-data-wrapper/constituent-grid-data-wrapper.component';
import { ConstituentGridComponent } from './constituent-grid/constituent-grid.component';
import { ConstituentDetailComponent } from './constituent-detail/constituent-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomepageComponent,
    ConstituentGridFilterComponent,
    ConstituentGridDataWrapperComponent,
    ConstituentGridComponent,
    ConstituentDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
