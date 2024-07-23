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
import {PaymentComponent} from "./view/modules/payment/payment.component";
import {ClinicComponent} from "./view/modules/clinic/clinic.component";
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
      {path: "home", component: HomeComponent},
      {path: "dashboard", component: DashboardComponent},
      {path: "employee", component: EmployeeComponent},
      {path: "user", component: UserComponent},
      {path: "clinic", component: ClinicComponent},
      {path: "doctor", component: DoctorComponent},
      {path:"reports", component: ArrearsByProgramComponent},
      {path:"reports/cliniccountbyclinictype", component: CliniccountbyclinictypeComponent},
      {path:"reports/countbydesignation", component: CountByDesignationComponent},
      {path:"payments",component:PaymentComponent},
      {path: "home/payments", redirectTo: 'payments', pathMatch: 'full'},
      {path: "home/batchregistration", redirectTo: 'batchregistration', pathMatch: 'full'},
      {path: "home/students", redirectTo: 'students', pathMatch: 'full'},
      {path: "home/class", redirectTo: 'class', pathMatch: 'full'},
      {path: "home/books", redirectTo: 'books', pathMatch: 'full'},
      {path:"attendance",component:AttendanceComponent},
      {path: "home/clinic", component: ClinicComponent},
      {path: "home/doctor", component: DoctorComponent},
      // {path: "main/dashboard/reports", component: CountByDesignationComponent},
      {path: "home/patient", component: PatientComponent},
      {path: "home/attendance", redirectTo: 'attendance', pathMatch: 'full'},

    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
