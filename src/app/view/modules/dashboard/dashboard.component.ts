import { Component } from '@angular/core';
import {EmployeeService} from "../../../service/employeeservice";
import {Employee} from "../../../entity/employee";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  name:string = "Amila Bandara";
  patientcount:any  = 0;

  constructor(
    private emps:EmployeeService,
  ) {
  }
  ngOnint():void{
    this.initialize();
  }
  initialize(){
    console.log("why this not happening")
    this.emps.countbydesignation(2).then((emp: number| undefined) => {
      console.log(emp);
      this.patientcount = emp;
    });
  }
}
