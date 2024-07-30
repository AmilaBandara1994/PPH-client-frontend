import {Patientstatus} from "./patientstatus";
import {Gender} from "./gender";
import {Bloodgroup} from "./bloodgroup";
import {Employee} from "./employee";
import {Family} from "./family";
import {Relationship} from "./relationship";

export class Patient {

  public id !: number;
  public name !: string;
  public dob !: string;
  public nic !: string;
  public email !: string;
  public photo !: string;
  public contactnumber !: string;
  public description !: string;
  public  patientstatus!: Patientstatus;
  public  gender!: Gender;
  public  bloodgroup!: Bloodgroup;
  public  employee!: Employee;
  public  family!: Family;
  public  relationship!: Relationship;


  constructor(id: number, name: string, dob: string, nic: string, email: string, photo: string, contactnumber: string, description: string, patientstatus: Patientstatus, gender: Gender, bloodgroup: Bloodgroup, employee: Employee, family: Family, relationship: Relationship) {
    this.id = id;
    this.name = name;
    this.dob = dob;
    this.nic = nic;
    this.email = email;
    this.photo = photo;
    this.contactnumber = contactnumber;
    this.description = description;
    this.patientstatus = patientstatus;
    this.gender = gender;
    this.bloodgroup = bloodgroup;
    this.employee = employee;
    this.family = family;
    this.relationship = relationship;
  }
}
