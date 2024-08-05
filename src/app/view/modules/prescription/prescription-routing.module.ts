import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PrescriptionComponent} from "./prescription.component";
import {PrescriptionViewComponent} from "./prescription-view/prescription-view.component";
import {PrescriptionDetailsComponent} from "./prescription-details/prescription-details.component";
import {PrescriptionFormComponent} from "./prescription-form/prescription-form.component";

const routes: Routes = [{
  path: '', component: PrescriptionComponent, children: [
    {path: '', component: PrescriptionViewComponent},
    {path: 'details/:id', component: PrescriptionDetailsComponent},
    {path: 'form', component: PrescriptionFormComponent},
    {path: 'update/:id', component: PrescriptionFormComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrescriptionRoutingModule { }
