import { Component } from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-patient-report',
  templateUrl: './patient-report.component.html',
  styleUrls: ['./patient-report.component.css']
})
export class PatientReportComponent {
  constructor( private _location: Location) {
  }

  backtoview() {
    this._location.back();
  }
}
