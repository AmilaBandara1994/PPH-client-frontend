import {Country} from "./country";

export class University {

  public id !: number;
  public name !: string;
  public country !: Country;

  constructor(id: number, name: string, country: Country) {
    this.id = id;
    this.name = name;
    this.country = country;
  }
}


