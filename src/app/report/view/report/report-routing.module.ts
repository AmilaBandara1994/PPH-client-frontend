import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReportComponent} from "./report.component";
import {ReportMainViewComponent} from "./report-main-view/report-main-view.component";

const routes: Routes = [{
  path: '', component: ReportComponent, children: [
    {path: '', component: ReportMainViewComponent},
    {path: 'patient', loadChildren: () => import('./patient-report/patient-report.module').then(m => m.PatientReportModule)},
    {path: 'diagnosis', loadChildren: () => import('./diagnosis-report/diagnosis-report.module').then(m => m.DiagnosisReportModule)},
    {path: 'doctor', loadChildren: () => import('./doctor-report/doctor-report.module').then(m => m.DoctorReportModule)},
    {path: 'drug', loadChildren: () => import('./drug-report/drug-report.module').then(m => m.DrugReportModule)},
    {path: 'clinic', loadChildren: () => import('./clinic-report/clinic-report.module').then(m => m.ClinicReportModule)},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
