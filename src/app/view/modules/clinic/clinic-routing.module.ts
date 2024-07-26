import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClinicComponent} from "./clinic.component";
import {ClinicViewComponent} from "./clinic-view/clinic-view.component";
import {ClinicFormComponent} from "./clinic-form/clinic-form.component";

const routes: Routes = [{
  path: '', component: ClinicComponent, children: [
    {path: '', component: ClinicViewComponent},
    {path: 'form', component: ClinicFormComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicRoutingModule { }
