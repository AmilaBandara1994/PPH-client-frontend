import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClinicReportRoutingModule } from './clinic-report-routing.module';
import { ClinicReportComponent } from './clinic-report.component';
import { ClinccountbyclinictypeComponent } from './clinccountbyclinictype/clinccountbyclinictype.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [
    ClinicReportComponent,
    ClinccountbyclinictypeComponent
  ],
    imports: [
        CommonModule,
        ClinicReportRoutingModule,
        FormsModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatTableModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class ClinicReportModule { }
