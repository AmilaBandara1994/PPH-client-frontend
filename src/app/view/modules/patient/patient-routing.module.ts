import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PatientComponent} from "./patient.component";
import {PatientViewComponent} from "./patient-view/patient-view.component";
import {PatientFormComponent} from "./patient-form/patient-form.component";
import {PatientDetailsComponent} from "./patient-details/patient-details.component";

const routes: Routes = [{
  path: '', component: PatientComponent,children: [
    {path: '', component: PatientViewComponent},
    {path: 'details/:id', component: PatientDetailsComponent},
    {path: 'form', component: PatientFormComponent},
    {path: 'update/:id', component: PatientFormComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
