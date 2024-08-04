import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';
import {MatButtonModule} from "@angular/material/button";
import { ReportMainViewComponent } from './report-main-view/report-main-view.component';


@NgModule({
  declarations: [
    ReportComponent,
    ReportMainViewComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    MatButtonModule
  ]
})
export class ReportModule { }
