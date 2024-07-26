import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorRoutingModule } from './doctor-routing.module';
import { DoctorViewComponent } from './doctor-view/doctor-view.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';


@NgModule({
  declarations: [
    DoctorViewComponent,
    DoctorFormComponent
  ],
  imports: [
    CommonModule,
    DoctorRoutingModule
  ]
})
export class DoctorModule { }
