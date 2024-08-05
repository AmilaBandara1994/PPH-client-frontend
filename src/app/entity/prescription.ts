import {Appointment} from "./appointment";
import {Prescriptionstatus} from "./prescriptionstatus";
import {Prescriptiondrug} from "./prescriptiondrug";

export class Prescription {

  public id !: number;
  public date !: string;
  public appointment !: Appointment;
  public prescriptiondrugs!:Array<Prescriptiondrug>;
  public prescriptionstatus !: Prescriptionstatus;


  constructor(id: number, date: string, appointment: Appointment, prescriptiondrugs: Array<Prescriptiondrug>, prescriptionstatus: Prescriptionstatus) {
    this.id = id;
    this.date = date;
    this.appointment = appointment;
    this.prescriptiondrugs = prescriptiondrugs;
    this.prescriptionstatus = prescriptionstatus;
  }
}
