import {BrowserModule, Meta} from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ConstituentGridFilterComponent } from './constituent-grid-filter/constituent-grid-filter.component';
import { ConstituentGridDataWrapperComponent } from './constituent-grid/constituent-grid-data-wrapper.component';
import { ConstituentGridComponent } from './constituent-grid/constituent-grid.component';
import { ConstituentDetailComponent } from './constituent-detail/constituent-detail.component';
import { ConstituentDetailDataWrapperComponent } from './constituent-detail/constituent-detail-data-wrapper.component';
import { FooterComponent } from './footer/footer.component';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { AboutComponent } from './about/about.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomepageComponent,
    ConstituentGridFilterComponent,
    ConstituentGridDataWrapperComponent,
    ConstituentGridComponent,
    ConstituentDetailComponent,
    ConstituentDetailDataWrapperComponent,
    FooterComponent,
    FourOhFourComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [Meta],
  bootstrap: [AppComponent]
})
export class AppModule { }
