import {Appointment} from "./appointment";
import {Reporttype} from "./reporttype";
import {Investigationstatus} from "./investigationstatus";
import {Investigationresult} from "./investigationresult";
import {Employee} from "./employee";
import {Diagnosis} from "./diagnosis";

export class Investigation {

  public id !: number;
  public name !: string;
  public appointment !: Appointment;
  public reporteddate !: string;
  public date !: Date;
  public report !: string;
  public reporttype !: Reporttype;
  public description !: string;
  public investigationstatus !: Investigationstatus;
  public investigationresult !: Investigationresult;
  public conclution !: string;
  public employee !: Employee;


  constructor(id: number, name: string, appointment: Appointment, reporteddate: string, date: Date, report: string, reporttype: Reporttype, description: string, investigationstatus: Investigationstatus, investigationresult: Investigationresult, conclution: string, employee: Employee) {
    this.id = id;
    this.name = name;
    this.appointment = appointment;
    this.reporteddate = reporteddate;
    this.date = date;
    this.report = report;
    this.reporttype = reporttype;
    this.description = description;
    this.investigationstatus = investigationstatus;
    this.investigationresult = investigationresult;
    this.conclution = conclution;
    this.employee = employee;
  }
}
