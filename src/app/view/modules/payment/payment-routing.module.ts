import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent} from "./payment.component";
import {PatientPaymentViewComponent} from "./patient-payment-view/patient-payment-view.component";
import {PatientPaymentDetailsComponent} from "./patient-payment-details/patient-payment-details.component";
import {PatientPaymentFormComponent} from "./patient-payment-form/patient-payment-form.component";
import {PaymentCommonComponent} from "./payment-common/payment-common.component";
import {DoctorPaymentViewComponent} from "./doctor-payment-view/doctor-payment-view.component";
import {DoctorPaymentDetailsComponent} from "./doctor-payment-details/doctor-payment-details.component";
import {DoctorPaymentFormComponent} from "./doctor-payment-form/doctor-payment-form.component";

const routes: Routes = [{
  path: '', component: PaymentComponent, children: [
    {path: '', component: PaymentCommonComponent},
    {path: 'patient', component: PatientPaymentViewComponent},
    {path: 'patient/details/:id', component: PatientPaymentDetailsComponent},
    {path: 'patient/form', component: PatientPaymentFormComponent},
    {path: 'patient/update/:id', component: PatientPaymentFormComponent},



    {path: 'doctor', component: DoctorPaymentViewComponent},
    {path: 'doctor/details/:id', component: DoctorPaymentDetailsComponent},
    {path: 'doctor/form', component: DoctorPaymentFormComponent},
    {path: 'doctor/update/:id', component: DoctorPaymentFormComponent},
    // {path: 'doctor', component: DoctorPaymentViewComponent, children:[
    //     {path: '', component: DoctorPaymentViewComponent},
    //     {path: 'details/:id', component: DoctorPaymentDetailsComponent},
    //     {path: 'form', component: DoctorPaymentFormComponent},
    //     {path: 'update/:id', component: DoctorPaymentFormComponent},
    //   ]},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
