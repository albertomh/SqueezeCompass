import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomepageComponent} from "./homepage/homepage.component";
import {ConstituentDetailDataWrapperComponent} from "./constituent-detail/constituent-detail-data-wrapper.component";
import {FourOhFourComponent} from "./four-oh-four/four-oh-four.component";


const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: '404', component: FourOhFourComponent},
  {path: ':symbol', component: ConstituentDetailDataWrapperComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
