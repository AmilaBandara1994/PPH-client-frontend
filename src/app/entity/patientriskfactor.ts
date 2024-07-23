import {Riskfactor} from "./riskfactor";
import {Patient} from "./patient";

export class Patientriskfactor {

  public id !: number;
  public riskfactor !: Riskfactor;
  public patient !: Patient;


  constructor(id: number, riskfactor: Riskfactor, patient: Patient) {
    this.id = id;
    this.riskfactor = riskfactor;
    this.patient = patient;
  }
}
