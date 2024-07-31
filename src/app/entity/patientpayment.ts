import {Appointment} from "./appointment";
import {Paytype} from "./paytype";
import {Paymentstatus} from "./paymentstatus";
import {Employee} from "./employee";
import {Doctordegree} from "./doctordegree";
import {Cardpayment} from "./cardpayment";

export class Patientpayment {

  public id !: number;
  public appointment !: Appointment;
  public paytype !: Paytype;
  public amount !: number;
  public paymentstatus !: Paymentstatus;
  public description !: string;
  public date !: string;
  public cardpayments!:Array<Cardpayment>;
  public employee !: Employee;


  constructor(id: number, appointment: Appointment, paytype: Paytype, amount: number, paymentstatus: Paymentstatus, description: string, date: string, cardpayments: Array<Cardpayment>, employee: Employee) {
    this.id = id;
    this.appointment = appointment;
    this.paytype = paytype;
    this.amount = amount;
    this.paymentstatus = paymentstatus;
    this.description = description;
    this.date = date;
    this.cardpayments = cardpayments;
    this.employee = employee;
  }
}
