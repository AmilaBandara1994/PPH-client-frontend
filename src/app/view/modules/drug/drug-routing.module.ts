import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DrugComponent} from "./drug.component";
import {DrugViewComponent} from "./drug-view/drug-view.component";
import {DrugDetailsComponent} from "./drug-details/drug-details.component";
import {DrugFormComponent} from "./drug-form/drug-form.component";

const routes: Routes = [{
  path: '', component: DrugComponent, children: [
    {path: '', component: DrugViewComponent},
    {path: 'details/:id', component: DrugDetailsComponent},
    {path: 'form', component: DrugFormComponent},
    {path: 'update/:id', component: DrugFormComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DrugRoutingModule { }
