import { Component } from '@angular/core';
import {Diagnosis} from "../../../../entity/diagnosis";
import {Diagnosisservice} from "../../../../service/diagnosisservice";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-diagnosis-details',
  templateUrl: './diagnosis-details.component.html',
  styleUrls: ['./diagnosis-details.component.css']
})
export class DiagnosisDetailsComponent {

  diagnosis!: Diagnosis;
  id!: number ;
  imagediagnosispurl: string ="assets/my-img/banner/diagnosis-bg.jpg";

  constructor(
    private ds:Diagnosisservice,
    private arouter:ActivatedRoute,
    private _location: Location,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.id = this.arouter.snapshot.params['id'];
    // @ts-ignore
    this.ds.get(this.id).then((diagnosis: Diagnosis) => {
      this.diagnosis = diagnosis
      console.log(diagnosis)
    });
    this.initialize();
  }
  initialize() {
  }
  backtoview() {
    this._location.back();
  }
  updateform() {
    this.router.navigateByUrl('main/diagnosis/update/'+this.id);
  }
}
