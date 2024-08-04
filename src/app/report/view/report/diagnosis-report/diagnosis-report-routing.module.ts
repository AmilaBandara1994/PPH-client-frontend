import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DiagnosisReportComponent} from "./diagnosis-report.component";
import {DoctorReportComponent} from "../doctor-report/doctor-report.component";
import {Countbytreatmentplan} from "../../../entity/countbytreatmentplan";
import {CountByTreatmentplanComponent} from "./count-by-treatmentplan/count-by-treatmentplan.component";

const routes: Routes = [{
  path: '', component: DiagnosisReportComponent, children: [
    {path: '', component: CountByTreatmentplanComponent},
    // {path: 'cliniccountbyclinictype', component: ClinccountbyclinictypeComponent},
  ]
}];;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiagnosisReportRoutingModule { }
