import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InvestigationComponent} from "./investigation.component";
import {InvestigationViewComponent} from "./investigation-view/investigation-view.component";
import {InvestigationDetailsComponent} from "./investigation-details/investigation-details.component";
import {InvestigationFormComponent} from "./investigation-form/investigation-form.component";

const routes: Routes = [{
  path: '', component: InvestigationComponent, children: [
    {path: '', component: InvestigationViewComponent},
    {path: 'details/:id', component: InvestigationDetailsComponent},
    {path: 'form', component: InvestigationFormComponent},
    {path: 'update/:id', component: InvestigationFormComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestigationRoutingModule { }
