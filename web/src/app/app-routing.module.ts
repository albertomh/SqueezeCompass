import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomepageComponent} from "./homepage/homepage.component";
import {ConstituentDetailDataWrapperComponent} from "./constituent-detail-data-wrapper/constituent-detail-data-wrapper.component";


const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: ':symbol', component: ConstituentDetailDataWrapperComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
