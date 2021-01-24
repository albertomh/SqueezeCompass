import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomepageComponent} from "./homepage/homepage.component";
import {ConstituentDetailComponent} from "./constituent-detail/constituent-detail.component";


const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: ':symbol', component: ConstituentDetailComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
