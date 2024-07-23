import {District} from "./district";

export class Family {

  public id !: number;
  public district !: District;
  public doregister !: string;
  public name !: string;
  public address !: string;
  public mobile !: string;
  public land !: string;
  public description !: string;
  public maplocation !: string;


  constructor(id: number, district: District, doregister: string, name: string, address: string, mobile: string, land: string, description: string, maplocation: string) {
    this.id = id;
    this.district = district;
    this.doregister = doregister;
    this.name = name;
    this.address = address;
    this.mobile = mobile;
    this.land = land;
    this.description = description;
    this.maplocation = maplocation;
  }
}
