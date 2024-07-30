import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppointmentComponent} from "./appointment.component";
import {AppointmentViewComponent} from "./appointment-view/appointment-view.component";
import {AppointmentDetailsComponent} from "./appointment-details/appointment-details.component";
import {AppointmentFormComponent} from "./appointment-form/appointment-form.component";

const routes: Routes = [{
  path: '', component: AppointmentComponent, children: [
    {path: '', component: AppointmentViewComponent},
    {path: 'details/:id', component: AppointmentDetailsComponent},
    {path: 'form', component: AppointmentFormComponent},
    {path: 'update/:id', component: AppointmentFormComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentRoutingModule { }
