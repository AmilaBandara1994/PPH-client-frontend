import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PatientReportComponent} from "./patient-report.component";
import {PatientcountbybloodgroupComponent} from "./patientcountbybloodgroup/patientcountbybloodgroup.component";
import {PatientcountbyclinicbytimeComponent} from "./patientcountbyclinicbytime/patientcountbyclinicbytime.component";

const routes: Routes = [{
  path: '', component: PatientReportComponent, children: [
    {path: '', component: PatientcountbyclinicbytimeComponent},
    {path: 'countbyclinic', component: PatientcountbyclinicbytimeComponent},
    {path: 'countbybloodgroup', component: PatientcountbybloodgroupComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientReportRoutingModule { }
