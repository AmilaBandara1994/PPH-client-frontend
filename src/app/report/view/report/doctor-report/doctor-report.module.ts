import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorReportRoutingModule } from './doctor-report-routing.module';
import { DoctorReportComponent } from './doctor-report.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import { DoctorcountbyspecialityComponent } from './doctorcountbyspeciality/doctorcountbyspeciality.component';
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    DoctorReportComponent,
    DoctorcountbyspecialityComponent
  ],
  imports: [
    CommonModule,
    DoctorReportRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class DoctorReportModule { }
