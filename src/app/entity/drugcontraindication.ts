import {Indication} from "./indication";
import {Contraindication} from "./contraindication";

export class Drugcontraindication {

  public contraindication !: Contraindication;


  constructor(contraindication: Contraindication) {
    this.contraindication = contraindication;
  }
}


