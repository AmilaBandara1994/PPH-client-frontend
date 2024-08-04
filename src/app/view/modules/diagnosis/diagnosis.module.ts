import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiagnosisRoutingModule } from './diagnosis-routing.module';
import { DiagnosisComponent } from './diagnosis.component';
import { DiagnosisVeiwComponent } from './diagnosis-veiw/diagnosis-veiw.component';
import { DiagnosisFormComponent } from './diagnosis-form/diagnosis-form.component';
import { DiagnosisDetailsComponent } from './diagnosis-details/diagnosis-details.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatListModule} from "@angular/material/list";


@NgModule({
  declarations: [
    DiagnosisComponent,
    DiagnosisVeiwComponent,
    DiagnosisFormComponent,
    DiagnosisDetailsComponent
  ],
  imports: [
    CommonModule,
    DiagnosisRoutingModule,
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
    MatGridListModule,
    MatListModule
  ]
})
export class DiagnosisModule { }
