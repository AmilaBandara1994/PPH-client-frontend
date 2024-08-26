import {Bloodgroup} from "../../entity/bloodgroup";

export class PatientCountByBloodgroup {

  public id !: number;
  public name !: string;
  public count !: number;
  public bloodgroup!: string;

  constructor(id:number,name:string,count:number,bloodgroup:string) {
    this.id=id;
    this.name=name;
    this.count=count;
    this.bloodgroup=bloodgroup;
  }

}
