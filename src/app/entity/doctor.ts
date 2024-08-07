import {Employee} from "./employee";
import {Doctorgrade} from "./doctorgrade";
import {Country} from "./country";
import {Doctordegree} from "./doctordegree";
import {Doctorclinictype} from "./doctorclinictype";

export class Doctor {

  public id !: number;
  public doctorclinictype !: Array<Doctorclinictype>;
  public employee !: Employee;
  public doctorgrade !: Doctorgrade;
  public description !: string;
  public slmcregno !: string;
  public doslmcregisterd !: string;
  public foreigntraining !: string;
  public doctordegrees!:Array<Doctordegree>;
  public country !: Country;


  constructor(id: number, doctorclinictype: Array<Doctorclinictype>, employee: Employee, doctorgrade: Doctorgrade, description: string, slmcregno: string, doslmcregisterd: string, foreigntraining: string, doctordegrees: Array<Doctordegree>, country: Country) {
    this.id = id;
    this.doctorclinictype = doctorclinictype;
    this.employee = employee;
    this.doctorgrade = doctorgrade;
    this.description = description;
    this.slmcregno = slmcregno;
    this.doslmcregisterd = doslmcregisterd;
    this.foreigntraining = foreigntraining;
    this.doctordegrees = doctordegrees;
    this.country = country;
  }
}
