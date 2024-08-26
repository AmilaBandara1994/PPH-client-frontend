import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {Prescription} from "../../../../entity/prescription";
import {PrescriptionService} from "../../../../service/prescriptionservice";

@Component({
  selector: 'app-prescription-details',
  templateUrl: './prescription-details.component.html',
  styleUrls: ['./prescription-details.component.css']
})
export class PrescriptionDetailsComponent {

  title:string = 'Prescription';
  prescription!: Prescription;
  id!: number ;
  imagediagnosispurl: string ="assets/my-img/banner/diagnosis-bg.jpg";

  constructor(
    private ds:PrescriptionService,
    private arouter:ActivatedRoute,
    private _location: Location,
    private router: Router,
  ) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.id = this.arouter.snapshot.params['id'];
    // @ts-ignore
    this.ds.get(this.id).then((prescription: Prescription) => {
      this.prescription = prescription
      console.log(prescription)
    });
    this.initialize();
  }
  initialize() {
  }
  backtoview() {
    this._location.back();
  }
  updateform() {
    this.router.navigateByUrl('main/prescription/update/'+this.id);
  }
}
