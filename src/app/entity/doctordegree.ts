import {Degree} from "./degree";
import {University} from "./university";
import {Doctor} from "./doctor";

export class Doctordegree {

  public id !: number;
  public year !: string;
  public degree !: Degree;
  public university !: University;
  public doctor !: Doctor;


  constructor(year: string, degree: Degree, university: University) {
    this.year = year;
    this.degree = degree;
    this.university = university;
  }
}


