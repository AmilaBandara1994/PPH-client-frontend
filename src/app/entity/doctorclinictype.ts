import {Doctor} from "./doctor";
import {Clinictype} from "./clinictype";

export class Doctorclinictype {

  public id !: number;
  public doctor !: Doctor;
  public clinictype !: Clinictype;


  constructor(id: number, doctor: Doctor, clinictype: Clinictype) {
    this.id = id;
    this.doctor = doctor;
    this.clinictype = clinictype;
  }
}


