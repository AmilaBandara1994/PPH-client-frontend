import { Component } from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-clinic-report',
  templateUrl: './clinic-report.component.html',
  styleUrls: ['./clinic-report.component.css']
})
export class ClinicReportComponent {
  constructor( private _location: Location) {
  }

  backtoview() {
    this._location.back();
  }
}
