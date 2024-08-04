import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorReportRoutingModule } from './doctor-report-routing.module';
import { DoctorReportComponent } from './doctor-report.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [
    DoctorReportComponent
  ],
    imports: [
        CommonModule,
        DoctorReportRoutingModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class DoctorReportModule { }
