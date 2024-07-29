import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorRoutingModule } from './doctor-routing.module';
import { DoctorViewComponent } from './doctor-view/doctor-view.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';
import { DoctorDetailsComponent } from './doctor-details/doctor-details.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatListModule} from "@angular/material/list";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatGridListModule} from "@angular/material/grid-list";


@NgModule({
  declarations: [
    DoctorViewComponent,
    DoctorFormComponent,
    DoctorDetailsComponent
  ],
  imports: [
    CommonModule,
    DoctorRoutingModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    ReactiveFormsModule,
    MatListModule,
    MatDatepickerModule,
    MatGridListModule
  ]
})
export class DoctorModule { }
