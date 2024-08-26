import {Doctor} from "./doctor";
import {Clinictype} from "./clinictype";

export class Doctorclinictype {

  public clinictype !: Clinictype;


  constructor(clinictype: Clinictype) {
    this.clinictype = clinictype;
  }
}


