import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {Appointment} from "../../../../entity/appointment";
import {AppointmentService} from "../../../../service/appointment.service";

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.css']
})
export class AppointmentDetailsComponent {

  appointment!: Appointment;
  id!: number ;
  imgappoinmenturl: string ="assets/my-img/banner/appointment-bg.png";
  constructor(
    private as:AppointmentService,
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
    this.as.get(this.id).then((appointment: Appointment) => {
      console.log(appointment)
      this.appointment = appointment
    });

  }

  backtoview() {
    this._location.back();
  }

  updateform() {
    this.router.navigateByUrl('main/appointments/update/'+this.id);
  }
}
