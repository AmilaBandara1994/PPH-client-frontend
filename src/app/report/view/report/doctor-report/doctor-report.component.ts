import { Component } from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-doctor-report',
  templateUrl: './doctor-report.component.html',
  styleUrls: ['./doctor-report.component.css']
})
export class DoctorReportComponent {
  constructor( private _location: Location) {
  }

  backtoview() {
    this._location.back();
  }
}
