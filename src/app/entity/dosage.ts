export class Dosage {

  public id !: number;
  public name !: string;
  public value !: string;


  constructor(id: number, name: string, value: string) {
    this.id = id;
    this.name = name;
    this.value = value;
  }
}
