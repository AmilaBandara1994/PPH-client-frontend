import {Doctorpaymentstatus} from "./doctorpaymentstatus";
import {Clinic} from "./clinic";
import {Employee} from "./employee";

export class Doctorpayment {

  public id !: number;
  public date !: string;
  public total !: number;
  public description !: string;
  public doctorpaymetstatus !: Doctorpaymentstatus;
  public clinic !: Clinic;
  public employee !: Employee;
  public paiddate !: string | null;


  constructor(id: number, date: string, total: number, description: string, doctorpaymetstatus: Doctorpaymentstatus, clinic: Clinic, employee: Employee, paiddate: string) {
    this.id = id;
    this.date = date;
    this.total = total;
    this.description = description;
    this.doctorpaymetstatus = doctorpaymetstatus;
    this.clinic = clinic;
    this.employee = employee;
    this.paiddate = paiddate;
  }
}
