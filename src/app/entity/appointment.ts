import {Clinic} from "./clinic";
import {Patient} from "./patient";
import {Appointmentstatus} from "./appointmentstatus";
import {Appointmenttype} from "./appointmenttype";
import {Employee} from "./employee";

export class Appointment {

  public id !: number;
  public number !: string;
  public clinic !: Clinic;
  public patient !: Patient;
  public appointmentstatus !: Appointmentstatus;
  public appointmenttype !: Appointmenttype;
  public employee !: Employee;
  public date !: string;
  public description !: string;


  constructor(id: number, number: string, clinic: Clinic, patient: Patient, appointmentstatus: Appointmentstatus, appointmenttype: Appointmenttype, employee: Employee, date: string, description: string) {
    this.id = id;
    this.number = number;
    this.clinic = clinic;
    this.patient = patient;
    this.appointmentstatus = appointmentstatus;
    this.appointmenttype = appointmenttype;
    this.employee = employee;
    this.date = date;
    this.description = description;
  }
}
