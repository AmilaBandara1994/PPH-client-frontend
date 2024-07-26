import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DoctorComponent} from "./doctor.component";
import {DoctorViewComponent} from "./doctor-view/doctor-view.component";
import {DoctorFormComponent} from "./doctor-form/doctor-form.component";

const routes: Routes = [{
  path: '', component: DoctorComponent,children: [
    {path: 'view', component: DoctorViewComponent},
    {path: 'form', component: DoctorFormComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }
