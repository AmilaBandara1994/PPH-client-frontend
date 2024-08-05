import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientReportRoutingModule } from './patient-report-routing.module';
import { PatientReportComponent } from './patient-report.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [
    PatientReportComponent
  ],
    imports: [
        CommonModule,
        PatientReportRoutingModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class PatientReportModule { }
