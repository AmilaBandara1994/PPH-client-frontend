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
import {DoctorComponent} from "./view/modules/doctor/doctor.component";
import {PatientComponent} from "./view/modules/patient/patient.component";
import {DashboardComponent} from "./view/modules/dashboard/dashboard.component";

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "", redirectTo: 'login', pathMatch: 'full'},
  {
    path: "main",
    component: MainwindowComponent,
    children: [

      {path: "", component: DashboardComponent},
      {path: 'patient', loadChildren: () => import('./view/modules/patient/patient.module').then(m => m.PatientModule)},
      {path: 'doctor', loadChildren: () => import('./view/modules/doctor/doctor.module').then(m => m.DoctorModule)},
      {path: 'clinic', loadChildren: () => import('./view/modules/clinic/clinic.module').then(m => m.ClinicModule)},
      {path: 'appointment', loadChildren: () => import('./view/modules/appointment/appointment.module').then(m => m.AppointmentModule)},
      {path: 'payment', loadChildren: () => import('./view/modules/payment/payment.module').then(m => m.PaymentModule)},
      //
      // {path: 'home/patient', loadChildren: () => import('./view/modules/patient/patient.module').then(m => m.PatientModule)},
      // {path: 'home/doctor', loadChildren: () => import('./view/modules/doctor/doctor.module').then(m => m.DoctorModule)},
      // {path: 'home/clinic', loadChildren: () => import('./view/modules/clinic/clinic.module').then(m => m.ClinicModule)},
      //

      {path: "home", component: HomeComponent},
      {path: "dashboard", component: DashboardComponent},
      {path: "employee", component: EmployeeComponent},
      {path: "user", component: UserComponent},
      {path:"reports", component: ArrearsByProgramComponent},
      {path:"reports/cliniccountbyclinictype", component: CliniccountbyclinictypeComponent},
      {path:"reports/countbydesignation", component: CountByDesignationComponent},
      // {path:"payments",component:PaymentComponent},
      {path: "home/payments", redirectTo: 'payments', pathMatch: 'full'},
      {path: "home/batchregistration", redirectTo: 'batchregistration', pathMatch: 'full'},
      {path: "home/students", redirectTo: 'students', pathMatch: 'full'},
      {path: "home/class", redirectTo: 'class', pathMatch: 'full'},
      {path: "home/books", redirectTo: 'books', pathMatch: 'full'},
      {path:"attendance",component:AttendanceComponent},
      // {path: "main/dashboard/reports", component: CountByDesignationComponent},
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
