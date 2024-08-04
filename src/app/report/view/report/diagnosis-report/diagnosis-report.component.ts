import { Component } from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-diagnosis-report',
  templateUrl: './diagnosis-report.component.html',
  styleUrls: ['./diagnosis-report.component.css']
})
export class DiagnosisReportComponent {
  constructor( private _location: Location) {
  }

  backtoview() {
    this._location.back();
  }
}
