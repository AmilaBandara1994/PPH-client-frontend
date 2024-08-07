import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./view/login/login.component";
import {MainwindowComponent} from "./view/mainwindow/mainwindow.component";
import {EmployeeComponent} from "./view/modules/employee/employee.component";
import {HomeComponent} from "./view/home/home.component";
import {UserComponent} from "./view/modules/user/user.component";
import {CountByDesignationComponent} from "./report/view/countbydesignation/countbydesignation.component";
import {ArrearsByProgramComponent} from "./report/view/arrearsbyprogram/arrearsbyprogram.component";
import {AttendanceComponent} from "./view/modules/attendance/attendance.component";
import {
  CliniccountbyclinictypeComponent
} from "./report/view/cliniccountbyclinictype/cliniccountbyclinictype.component";
import {DashboardComponent} from "./view/modules/dashboard/dashboard.component";

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "", redirectTo: 'login', pathMatch: 'full'},
  {
    path: "main",
    component: MainwindowComponent,
    children: [
      {path: "", component: DashboardComponent},
      {path: "home", component: HomeComponent},
      {path: "dashboard", component: DashboardComponent},
      {path: "employee", component: EmployeeComponent},
      {path: "user", component: UserComponent},

      {path: 'patient', loadChildren: () => import('./view/modules/patient/patient.module').then(m => m.PatientModule)},
      {path: 'doctor', loadChildren: () => import('./view/modules/doctor/doctor.module').then(m => m.DoctorModule)},
      {path: 'clinic', loadChildren: () => import('./view/modules/clinic/clinic.module').then(m => m.ClinicModule)},
      {path: 'appointment', loadChildren: () => import('./view/modules/appointment/appointment.module').then(m => m.AppointmentModule)},
      {path: 'payment', loadChildren: () => import('./view/modules/payment/payment.module').then(m => m.PaymentModule)},
      {path: 'drug', loadChildren: () => import('./view/modules/drug/drug.module').then(m => m.DrugModule)},
      {path: 'diagnosis', loadChildren: () => import('./view/modules/diagnosis/diagnosis.module').then(m => m.DiagnosisModule)},
      {path: 'report', loadChildren: () => import('./report/view/report/report.module').then(m => m.ReportModule)},
      {path: 'family', loadChildren: () => import('./view/modules/family/family.module').then(m => m.FamilyModule)},
      {path: 'prescription', loadChildren: () => import('./view/modules/prescription/prescription.module').then(m => m.PrescriptionModule)},
      {path: 'investigation', loadChildren: () => import('./view/modules/investigation/investigation.module').then(m => m.InvestigationModule)},

      {path:"reports", component: ArrearsByProgramComponent},
      {path:"reports/cliniccountbyclinictype", component: CliniccountbyclinictypeComponent},
      {path:"reports/countbydesignation", component: CountByDesignationComponent},
      // {path:"payments",component:PaymentComponent},
      {path: "home/payments", redirectTo: 'payments', pathMatch: 'full'},

      {path:"attendance",component:AttendanceComponent},
      {path: "home/attendance", redirectTo: 'attendance', pathMatch: 'full'},

    ]
  }

  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
