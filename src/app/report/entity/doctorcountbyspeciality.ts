
export class DoctorCountBySpeciality {

  public id !: number;
  public clinicttype!: string;
  public count !: number;

  constructor(id: number, clinicttype: string, count: number) {
    this.id = id;
    this.clinicttype = clinicttype;
    this.count = count;
  }
}
