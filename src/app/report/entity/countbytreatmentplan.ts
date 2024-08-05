export class Countbytreatmentplan {

  public id !: number;
  public treatmentplan !: string;
  public count !: number;
  public perecentage !: number;


  constructor(id: number, treatmentplan: string, count: number, perecentage: number) {
    this.id = id;
    this.treatmentplan = treatmentplan;
    this.count = count;
    this.perecentage = perecentage;
  }
}
