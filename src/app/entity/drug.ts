import {Generic} from "./generic";
import {Brand} from "./brand";
import {Drugform} from "./drugform";
import {Drugroute} from "./drugroute";
import {Employee} from "./employee";
import {Drugstatus} from "./drugstatus";
import {Drugadverseeffect} from "./drugadverseeffect";
import {Drugcontraindication} from "./drugcontraindication";
import {Drugindication} from "./drugindication";

export class Drug {

  public id !: number;
  public generic !: Generic;
  public brand !: Brand;
  public drugform !: Drugform;
  public drugroute !: Drugroute;
  public strength !: number;
  public code !: string;
  public name !: string;
  public photo !: string;
  public description !: string;
  public qoh !: number;
  public rop !: number;
  public sprice !: number;
  public pprice !: number;
  public dointroduced !: Date;
  public drugstatus !: Drugstatus;
  public employee !: Employee ;
  public drugadverseeffects!:Array<Drugadverseeffect>;
  public drugcontraindications!:Array<Drugcontraindication>;
  public drugindications!:Array<Drugindication>;


  constructor(id: number, generic: Generic, brand: Brand, drugform: Drugform, drugroute: Drugroute, strength: number, code: string, name: string, photo: string, description: string, qoh: number, rop: number, sprice: number, pprice: number, dointroduced: Date, drugstatus: Drugstatus, employee: Employee, drugadverseeffects: Array<Drugadverseeffect>, drugcontraindications: Array<Drugcontraindication>, drugindications: Array<Drugindication>) {
    this.id = id;
    this.generic = generic;
    this.brand = brand;
    this.drugform = drugform;
    this.drugroute = drugroute;
    this.strength = strength;
    this.code = code;
    this.name = name;
    this.photo = photo;
    this.description = description;
    this.qoh = qoh;
    this.rop = rop;
    this.sprice = sprice;
    this.pprice = pprice;
    this.dointroduced = dointroduced;
    this.drugstatus = drugstatus;
    this.employee = employee;
    this.drugadverseeffects = drugadverseeffects;
    this.drugcontraindications = drugcontraindications;
    this.drugindications = drugindications;
  }
}
