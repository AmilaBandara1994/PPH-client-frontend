import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FamilyComponent} from "./family.component";
import {FamilyViewComponent} from "./family-view/family-view.component";
import {FamilyDetailsComponent} from "./family-details/family-details.component";
import {FamilyFormComponent} from "./family-form/family-form.component";

const routes: Routes = [{
  path: '', component: FamilyComponent, children: [
    {path: '', component: FamilyViewComponent},
    {path: 'details/:id', component: FamilyDetailsComponent},
    {path: 'form', component: FamilyFormComponent},
    {path: 'update/:id', component: FamilyFormComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FamilyRoutingModule { }
