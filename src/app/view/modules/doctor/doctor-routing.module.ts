import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DoctorComponent} from "./doctor.component";
import {DoctorViewComponent} from "./doctor-view/doctor-view.component";
import {DoctorFormComponent} from "./doctor-form/doctor-form.component";
import {DoctorDetailsComponent} from "./doctor-details/doctor-details.component";

const routes: Routes = [{
  path: '', component: DoctorComponent,children: [
    {path: '', component: DoctorViewComponent},
    {path: 'details/:id', component: DoctorDetailsComponent},
    {path: 'form', component: DoctorFormComponent},
    {path: 'update/:id', component: DoctorFormComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }
