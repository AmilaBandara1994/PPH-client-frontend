import {District} from "./district";
import {Familystatus} from "./familystatus";
import {Employee} from "./employee";

export class Family {

  public id !: number;
  public district !: District;
  public doregister !: string;
  public name !: string;
  public address !: string;
  public mobile !: string;
  public land !: string;
  public description !: string;
  public familystatus !: Familystatus;
  public employee !: Employee;


  constructor(id: number, district: District, doregister: string, name: string, address: string, mobile: string, land: string, description: string, familystatus: Familystatus, employee: Employee) {
    this.id = id;
    this.district = district;
    this.doregister = doregister;
    this.name = name;
    this.address = address;
    this.mobile = mobile;
    this.land = land;
    this.description = description;
    this.familystatus = familystatus;
    this.employee = employee;
  }
}
