import {Bank} from "./bank";
import {Patientpayment} from "./patientpayment";

export class Cardpayment {

  public id !: number;
  public bankbranch !: string;
  public number !: number;
  public bank!:Bank;
  public patientpayment!: Patientpayment;


  constructor(id: number, bankbranch: string, number: number, bank: Bank, patientpayment: Patientpayment) {
    this.id = id;
    this.bankbranch = bankbranch;
    this.number = number;
    this.bank = bank;
    this.patientpayment = patientpayment;
  }

}
