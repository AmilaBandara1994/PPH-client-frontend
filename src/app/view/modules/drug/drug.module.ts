import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrugRoutingModule } from './drug-routing.module';
import { DrugComponent } from './drug.component';
import { DrugViewComponent } from './drug-view/drug-view.component';
import { DrugFormComponent } from './drug-form/drug-form.component';
import { DrugDetailsComponent } from './drug-details/drug-details.component';
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {ReactiveFormsModule} from "@angular/forms";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatListModule} from "@angular/material/list";


@NgModule({
  declarations: [
    DrugComponent,
    DrugViewComponent,
    DrugFormComponent,
    DrugDetailsComponent
  ],
  imports: [
    CommonModule,
    DrugRoutingModule,
    MatButtonModule,
    MatDatepickerModule,
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
export class DrugModule { }
