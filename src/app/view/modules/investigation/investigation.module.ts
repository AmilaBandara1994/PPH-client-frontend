import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvestigationRoutingModule } from './investigation-routing.module';
import { InvestigationComponent } from './investigation.component';
import { InvestigationViewComponent } from './investigation-view/investigation-view.component';
import { InvestigationFormComponent } from './investigation-form/investigation-form.component';
import { InvestigationDetailsComponent } from './investigation-details/investigation-details.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";


@NgModule({
  declarations: [
    InvestigationComponent,
    InvestigationViewComponent,
    InvestigationFormComponent,
    InvestigationDetailsComponent
  ],
    imports: [
        CommonModule,
        InvestigationRoutingModule,
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
        MatDatepickerModule,
        MatPaginatorModule,
        MatTableModule
    ]
})
export class InvestigationModule { }
