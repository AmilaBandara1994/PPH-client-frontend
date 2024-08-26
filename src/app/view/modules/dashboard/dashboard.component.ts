import { Component } from '@angular/core';
import {EmployeeService} from "../../../service/employeeservice";
import {ClinicService} from "../../../service/clinic.service";
import {Clinic} from "../../../entity/clinic";
import {AuthorizationManager} from "../../../service/authorizationmanager";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  name:string = "Amila Bandara";
  patientcount:any  = 0;

  schedulelatest:Array<Clinic> = [];

  constructor(
    private emps:EmployeeService,
    private clinicService:ClinicService,
    public authService: AuthorizationManager,

  ) {
  }
  ngOnInit() {
    this.initialize();
      window.scrollTo(0, 0);
  }
  initialize(){

    this.emps.countbydesignation(2).then((emp: number| undefined) => {
      this.patientcount = emp;
    });

    this.clinicService.getlatest().then((clinics: Clinic[]) => {
      this.schedulelatest = clinics;
    });


  }

}
