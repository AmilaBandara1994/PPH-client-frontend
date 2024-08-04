import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DiagnosisComponent} from "./diagnosis.component";
import {DiagnosisVeiwComponent} from "./diagnosis-veiw/diagnosis-veiw.component";
import {DiagnosisDetailsComponent} from "./diagnosis-details/diagnosis-details.component";
import {DiagnosisFormComponent} from "./diagnosis-form/diagnosis-form.component";

const routes: Routes = [{
  path: '', component: DiagnosisComponent, children: [
    {path: '', component: DiagnosisVeiwComponent},
    {path: 'details/:id', component: DiagnosisDetailsComponent},
    {path: 'form', component: DiagnosisFormComponent},
    {path: 'update/:id', component: DiagnosisFormComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiagnosisRoutingModule { }
