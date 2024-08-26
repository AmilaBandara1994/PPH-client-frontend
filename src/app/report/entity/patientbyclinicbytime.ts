import {clinic} from "@igniteui/material-icons-extended";

export class PatientByClinicByTime {
  constructor(clinic: string, patient: number, stime: string, etime: string) {
    this.clinic = clinic;
    this.patients = patient;
    this.stime = stime;
    this.etime = etime;
  }

  public id !: number;
  public clinic !: string;
  public patients !: number;
  public stime !: string;
  public etime !: string;

}
