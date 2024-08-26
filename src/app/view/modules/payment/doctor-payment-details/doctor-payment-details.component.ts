import { Component } from '@angular/core';
import {Doctorpayment} from "../../../../entity/doctorpayment";
import {DoctorpaymentService} from "../../../../service/doctorpaymentservice";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-doctor-payment-details',
  templateUrl: './doctor-payment-details.component.html',
  styleUrls: ['./doctor-payment-details.component.css']
})
export class DoctorPaymentDetailsComponent {

  title:string = 'Doctor Payment';
  doctorpayment!: Doctorpayment;
  id!: number ;
  imagediagnosispurl: string ="assets/my-img/banner/diagnosis-bg.jpg";

  constructor(
    private ds:DoctorpaymentService,
    private arouter:ActivatedRoute,
    private _location: Location,
    private router: Router,
  ) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.id = this.arouter.snapshot.params['id'];
    // @ts-ignore
    this.ds.get(this.id).then((doctorpayment: Doctorpayment) => {
      this.doctorpayment = doctorpayment
      console.log(doctorpayment)
    });
    this.initialize();
  }
  initialize() {
  }
  backtoview() {
    this._location.back();
  }
  updateform() {
    this.router.navigateByUrl('main/doctorpayments/update/'+this.id);
  }
}
