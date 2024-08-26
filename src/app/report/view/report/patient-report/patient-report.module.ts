import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientReportRoutingModule } from './patient-report-routing.module';
import { PatientReportComponent } from './patient-report.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import { PatientcountbyclinicbytimeComponent } from './patientcountbyclinicbytime/patientcountbyclinicbytime.component';
import { PatientcountbybloodgroupComponent } from './patientcountbybloodgroup/patientcountbybloodgroup.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatOptionModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";


@NgModule({
  declarations: [
    PatientReportComponent,
    PatientcountbyclinicbytimeComponent,
    PatientcountbybloodgroupComponent
  ],
  imports: [
    CommonModule,
    PatientReportRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    FormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatOptionModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class PatientReportModule { }
