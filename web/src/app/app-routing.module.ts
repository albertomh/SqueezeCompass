import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomepageComponent} from "./homepage/homepage.component";
import {ConstituentDetailDataWrapperComponent} from "./constituent-detail/constituent-detail-data-wrapper.component";
import {FourOhFourComponent} from "./four-oh-four/four-oh-four.component";
import {AboutComponent} from "./about/about.component";


const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'about', component: AboutComponent},
  {path: '404', component: FourOhFourComponent},
  {path: ':symbol', component: ConstituentDetailDataWrapperComponent},
  {path: '**', redirectTo: '/404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
