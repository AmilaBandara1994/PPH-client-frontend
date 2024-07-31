import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent} from "./payment.component";
import {PatientPaymentViewComponent} from "./patient-payment-view/patient-payment-view.component";
import {PatientPaymentDetailsComponent} from "./patient-payment-details/patient-payment-details.component";
import {PatientPaymentFormComponent} from "./patient-payment-form/patient-payment-form.component";
import {PaymentCommonComponent} from "./payment-common/payment-common.component";

const routes: Routes = [{
  path: '', component: PaymentComponent, children: [
    {path: '', component: PaymentCommonComponent},
    {path: 'patient', component: PatientPaymentViewComponent},
    {path: 'details/:id', component: PatientPaymentDetailsComponent},
    {path: 'form', component: PatientPaymentFormComponent},
    {path: 'update/:id', component: PatientPaymentFormComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
