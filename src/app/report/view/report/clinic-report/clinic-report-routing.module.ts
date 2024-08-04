import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClinicReportComponent} from "./clinic-report.component";
import {ClinccountbyclinictypeComponent} from "./clinccountbyclinictype/clinccountbyclinictype.component";

const routes: Routes = [{
  path: '', component: ClinicReportComponent, children: [
    {path: '', component: ClinccountbyclinictypeComponent},
    {path: 'cliniccountbyclinictype', component: ClinccountbyclinictypeComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicReportRoutingModule { }
