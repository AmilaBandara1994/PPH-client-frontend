import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PatientPaymentViewComponent } from './patient-payment-view/patient-payment-view.component';
import { PatientPaymentFormComponent } from './patient-payment-form/patient-payment-form.component';
import { PatientPaymentDetailsComponent } from './patient-payment-details/patient-payment-details.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatGridListModule} from "@angular/material/grid-list";
import {PaymentComponent} from "./payment.component";
import { PaymentCommonComponent } from './payment-common/payment-common.component';
import { DoctorPaymentViewComponent } from './doctor-payment-view/doctor-payment-view.component';
import { DoctorPaymentDetailsComponent } from './doctor-payment-details/doctor-payment-details.component';
import { DoctorPaymentFormComponent } from './doctor-payment-form/doctor-payment-form.component';


@NgModule({
  declarations: [
    PaymentComponent,
    PatientPaymentViewComponent,
    PatientPaymentFormComponent,
    PatientPaymentDetailsComponent,
    PaymentCommonComponent,
    DoctorPaymentViewComponent,
    DoctorPaymentDetailsComponent,
    DoctorPaymentFormComponent
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    ReactiveFormsModule,
    MatGridListModule
  ]
})
export class PaymentModule { }
