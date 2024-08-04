import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FamilyRoutingModule } from './family-routing.module';
import { FamilyComponent } from './family.component';
import { FamilyViewComponent } from './family-view/family-view.component';
import { FamilyFormComponent } from './family-form/family-form.component';
import { FamilyDetailsComponent } from './family-details/family-details.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";


@NgModule({
  declarations: [
    FamilyComponent,
    FamilyViewComponent,
    FamilyFormComponent,
    FamilyDetailsComponent
  ],
  imports: [
    CommonModule,
    FamilyRoutingModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule
  ]
})
export class FamilyModule { }
