import { Component } from '@angular/core';
import {Clinic} from "../../../../entity/clinic";
import {ClinicService} from "../../../../service/clinic.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-clinic-details',
  templateUrl: './clinic-details.component.html',
  styleUrls: ['./clinic-details.component.css']
})
export class ClinicDetailsComponent{

  title:string = 'Clinic';
  imagediagnosispurl: string ="assets/my-img/clinic-details.jpg";


  clinic!: Clinic;
  id!: number ;

  constructor(
    private cs:ClinicService,
    private arouter:ActivatedRoute,
    private _location: Location,
    private router: Router,

  ) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.id = this.arouter.snapshot.params['id'];
    // @ts-ignore
    this.cs.get(this.id).then((clinic: Clinic) => {
      this.clinic = clinic
      console.log(clinic)

    });

    this.initialize();
  }
  initialize() {
    // @ts-ignore
    this.cs.get(this.id).then((clinic: Clinic) => {
      this.clinic = clinic
    });
  }

  backtoview() {
    this._location.back();
  }

  updateform() {
    this.router.navigateByUrl('main/clinic/update/'+this.id);
  }
}
