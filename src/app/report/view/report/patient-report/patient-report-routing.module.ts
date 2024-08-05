import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PatientReportComponent} from "./patient-report.component";
import {DrugReportComponent} from "../drug-report/drug-report.component";
import {
  DrugDispensationReportComponent
} from "../drug-report/drug-dispensation-report/drug-dispensation-report.component";

const routes: Routes = [{
  path: '', component: DrugReportComponent, children: [
    // {path: '', component: DrugDispensationReportComponent},
    // {path: 'dispensation', component: DrugDispensationReportComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientReportRoutingModule { }
