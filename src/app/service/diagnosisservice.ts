import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Diagnosis} from "../entity/diagnosis";

@Injectable({
  providedIn: 'root'
})
export class Diagnosisservice {

  constructor(private http: HttpClient) { }

  async getAll(query:string): Promise<Array<Diagnosis>> {
    const diagnoses = await this.http.get<Array<Diagnosis>>('http://localhost:8080/diagnoses/list'+query).toPromise();
    if(diagnoses == undefined){
      return [];
    }
    return diagnoses;
  }

  async getallBypatientId(id:number): Promise<Array<Diagnosis>> {
    const diagnoses = await this.http.get<Array<Diagnosis>>('http://localhost:8080/diagnoses/patientid/'+id).toPromise();
    if(diagnoses == undefined){
      return [];
    }
    return diagnoses;
  }


  async get(id:number): Promise<Diagnosis|undefined> {
    const diagnosis = await this.http.get<Diagnosis>('http://localhost:8080/diagnoses/details/'+ id).toPromise();
    if(diagnosis == undefined){
      return undefined;
    }
    return diagnosis;
  }

  async getcount(id:number): Promise<number> {
    const countbyclinic = await this.http.get<number>('http://localhost:8080/diagnoses/countbyclinic/'+ id).toPromise();
    if(countbyclinic == undefined){
      return 0;
    }
    return countbyclinic;
  }


  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/diagnoses/' + id).toPromise();
  }

  async update(diagnosis: Diagnosis): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/diagnoses', diagnosis).toPromise();
  }


  async add(diagnosis: Diagnosis): Promise<[]|undefined>{
    console.log('this  is from service' , diagnosis)
    return this.http.post<[]>('http://localhost:8080/diagnoses', diagnosis).toPromise();
  }
}
