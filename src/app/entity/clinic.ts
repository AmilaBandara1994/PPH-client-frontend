import {Clinictype} from "./clinictype";
import {Doctor} from "./doctor";
import {Employee} from "./employee";
import {Clinicstatus} from "./clinicstatus";

export class Clinic {

  public id !: number;
  public clinictype !: Clinictype;
  public doctor !: Doctor;
  public date !: string;
  public starttime !: string;
  public endtime !: string;
  public nurse1 !: Employee;
  public nurse2 !: Employee;
  public patientcount !: number;
  public totalincome !: number;
  public doctorpayment !: number;
  public clinicstatus !: Clinicstatus;
  public dopublish !: number;
  public employee !: Employee;


  constructor(id: number, clinictype: Clinictype, doctor: Doctor, date: string, starttime: string, endtime: string, nurse1: Employee, nurse2: Employee, patientcount: number, totalincome: number, doctorpayment: number, clinicstatus: Clinicstatus, dopublish: number, employee: Employee) {
    this.id = id;
    this.clinictype = clinictype;
    this.doctor = doctor;
    this.date = date;
    this.starttime = starttime;
    this.endtime = endtime;
    this.nurse1 = nurse1;
    this.nurse2 = nurse2;
    this.patientcount = patientcount;
    this.totalincome = totalincome;
    this.doctorpayment = doctorpayment;
    this.clinicstatus = clinicstatus;
    this.dopublish = dopublish;
    this.employee = employee;
  }
}
