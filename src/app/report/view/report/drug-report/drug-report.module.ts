import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrugReportRoutingModule } from './drug-report-routing.module';
import { DrugReportComponent } from './drug-report.component';
import { DrugDispensationReportComponent } from './drug-dispensation-report/drug-dispensation-report.component';
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import { DrugbybrandgenericstatusComponent } from './drugbybrandgenericstatus/drugbybrandgenericstatus.component';
import {MatPaginatorModule} from "@angular/material/paginator";


@NgModule({
  declarations: [
    DrugReportComponent,
    DrugDispensationReportComponent,
    DrugbybrandgenericstatusComponent,

  ],
  imports: [
    CommonModule,
    DrugReportRoutingModule,
    MatCardModule,
    MatGridListModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule
  ]
})
export class DrugReportModule { }
