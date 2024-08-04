import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DrugReportComponent} from "./drug-report.component";
import {DrugDispensationReportComponent} from "./drug-dispensation-report/drug-dispensation-report.component";

const routes: Routes = [{
  path: '', component: DrugReportComponent, children: [
    {path: '', component: DrugDispensationReportComponent},
    {path: 'dispensation', component: DrugDispensationReportComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DrugReportRoutingModule { }
