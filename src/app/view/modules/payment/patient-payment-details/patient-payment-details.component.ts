import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {Patientpaymentservice} from "../../../../service/patientpaymentservice";
import {Patientpayment} from "../../../../entity/patientpayment";

@Component({
  selector: 'app-patient-payment-details',
  templateUrl: './patient-payment-details.component.html',
  styleUrls: ['./patient-payment-details.component.css']
})
export class PatientPaymentDetailsComponent {

  title:string="Patient Payment"
  patientpayment!: Patientpayment;
  id!: number ;
  imagediagnosispurl: string ="assets/my-img/patient-payments.jpg";

  constructor(
    private ps:Patientpaymentservice,
    private arouter:ActivatedRoute,
    private _location: Location,
    private router: Router,
  ) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.id = this.arouter.snapshot.params['id'];
    // @ts-ignore
    this.ps.get(this.id).then((patientpayment: Patientpayment) => {
      this.patientpayment = patientpayment
      console.log(patientpayment)
    });
    this.initialize();
  }
  initialize() {
  }
  backtoview() {
    this._location.back();
  }
  updateform() {
    this.router.navigateByUrl('main/patient/update/'+this.id);
  }
}
