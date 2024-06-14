export class ClinicCountByClinictype {

  public id !: number;
  public clinicType !: string;
  public clinicCount !: number;
  public patientCount !: number;

  constructor(id:number,clinictype:string,cliniccount:number,patientcount:number) {
    this.id=id;
    this.clinicType=clinictype;
    this.clinicCount=cliniccount;
    this.patientCount=patientcount;
  }

}
