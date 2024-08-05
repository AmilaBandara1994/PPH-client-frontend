import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiagnosisReportRoutingModule } from './diagnosis-report-routing.module';
import { DiagnosisReportComponent } from './diagnosis-report.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import { CountByTreatmentplanComponent } from './count-by-treatmentplan/count-by-treatmentplan.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatPaginatorModule} from "@angular/material/paginator";


@NgModule({
  declarations: [
    DiagnosisReportComponent,
    CountByTreatmentplanComponent
  ],
    imports: [
        CommonModule,
        DiagnosisReportRoutingModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatTableModule,
        ReactiveFormsModule,
        MatCardModule,
        MatGridListModule,
        MatPaginatorModule
    ]
})
export class DiagnosisReportModule { }
