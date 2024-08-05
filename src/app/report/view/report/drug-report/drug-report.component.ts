import { Component } from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-drug-report',
  templateUrl: './drug-report.component.html',
  styleUrls: ['./drug-report.component.css']
})
export class DrugReportComponent {

  constructor( private _location: Location) {
  }

  backtoview() {
    this._location.back();
  }
}
