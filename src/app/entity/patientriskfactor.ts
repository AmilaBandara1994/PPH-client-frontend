import {Riskfactor} from "./riskfactor";
import {Patient} from "./patient";

export class Patientriskfactor {

  public id !: number;
  public riskfactor !: Riskfactor;
  public patient !: Patient;


  constructor(riskfactor: Riskfactor) {
    this.riskfactor = riskfactor;
  }
}
