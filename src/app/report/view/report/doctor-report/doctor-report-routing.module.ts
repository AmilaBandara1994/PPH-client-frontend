import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DoctorReportComponent} from "./doctor-report.component";
import {ClinicReportComponent} from "../clinic-report/clinic-report.component";
import {
  ClinccountbyclinictypeComponent
} from "../clinic-report/clinccountbyclinictype/clinccountbyclinictype.component";

const routes: Routes = [{
  path: '', component: DoctorReportComponent, children: [
    // {path: '', component: ClinccountbyclinictypeComponent},
    // {path: 'cliniccountbyclinictype', component: ClinccountbyclinictypeComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorReportRoutingModule { }
