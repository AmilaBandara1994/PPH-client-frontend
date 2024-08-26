import { Component } from '@angular/core';
import {Diagnosis} from "../../../../entity/diagnosis";
import {Diagnosisservice} from "../../../../service/diagnosisservice";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {Familyservice} from "../../../../service/familyservice";
import {Family} from "../../../../entity/family";

@Component({
  selector: 'app-family-details',
  templateUrl: './family-details.component.html',
  styleUrls: ['./family-details.component.css']
})
export class FamilyDetailsComponent {

  diagnosis!: Family;
  id!: number ;
  imagediagnosispurl: string ="assets/my-img/banner/diagnosis-bg.jpg";

  constructor(
    private ds:Familyservice,
    private arouter:ActivatedRoute,
    private _location: Location,
    private router: Router,
  ) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.id = this.arouter.snapshot.params['id'];
    // @ts-ignore
    this.ds.get(this.id).then((diagnosis: Family) => {
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
    this.router.navigateByUrl('main/families/update/'+this.id);
  }
}
