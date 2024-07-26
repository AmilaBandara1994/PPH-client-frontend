import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PatientComponent} from "./patient.component";
import {PatientViewComponent} from "./patient-view/patient-view.component";
import {PatientFormComponent} from "./patient-form/patient-form.component";

const routes: Routes = [{
  path: '', component: PatientComponent,children: [
    {path: 'view', component: PatientViewComponent},
    {path: 'form', component: PatientFormComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
