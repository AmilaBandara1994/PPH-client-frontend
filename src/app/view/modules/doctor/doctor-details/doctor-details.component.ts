import { Component } from '@angular/core';
import {Clinic} from "../../../../entity/clinic";
import {ClinicService} from "../../../../service/clinic.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {DoctorService} from "../../../../service/doctor.service";
import {Doctor} from "../../../../entity/doctor";

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css']
})
export class DoctorDetailsComponent {


  doctor!: Doctor;
  id!: number ;

  constructor(
    private ds:DoctorService,
    private arouter:ActivatedRoute,
    private _location: Location,
    private router: Router,

  ) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.id = this.arouter.snapshot.params['id'];
    this.initialize();

  }
  initialize() {
    // @ts-ignore
    this.ds.get(this.id).then((doctor: Doctor) => {
      console.log(doctor)
      this.doctor = doctor
    });
  }

  backtoview() {
    this._location.back();
  }

  updateform() {
    this.router.navigateByUrl('main/doctors/update/'+this.id);
  }
}
