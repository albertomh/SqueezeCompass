import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConstituentGridComponent } from './constituent-grid/constituent-grid.component';
import { ConstituentGridFilterComponent } from './constituent-grid-filter/constituent-grid-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    ConstituentGridComponent,
    ConstituentGridFilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
