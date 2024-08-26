export class PatientByClinics {
  constructor(clinic: string, patients: number, stime: string, etime: string) {
    this.clinic = clinic;
    this.patients = patients;
    this.stime = stime;
    this.etime = etime;
  }

  public clinic!: string;
  public patients !: number;
  public stime !: string;
  public etime !: string;

}
