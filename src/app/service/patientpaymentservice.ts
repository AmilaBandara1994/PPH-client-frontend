import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Patientpayment} from "../entity/patientpayment";

@Injectable({
  providedIn: 'root'
})
export class Patientpaymentservice {

  constructor(private http: HttpClient) { }

  async getAll(query:string): Promise<Array<Patientpayment>> {
    const patientpayments = await this.http.get<Array<Patientpayment>>('http://localhost:8080/patientpayments/list'+query).toPromise();
    if(patientpayments == undefined){
      return [];
    }
    return patientpayments;
  }

  async get(id:number): Promise<Patientpayment|undefined> {
    const patientpayment = await this.http.get<Patientpayment>('http://localhost:8080/patientpayments/details/'+ id).toPromise();
    if(patientpayment == undefined){
      return undefined;
    }
    return patientpayment;
  }

  async getcount(id:number): Promise<number> {
    const countbyclinic = await this.http.get<number>('http://localhost:8080/patientpayments/countbyclinic/'+ id).toPromise();
    if(countbyclinic == undefined){
      return 0;
    }
    return countbyclinic;
  }


  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/patientpayments/' + id).toPromise();
  }

  async update(patientpayment: Patientpayment): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/patientpayments', patientpayment).toPromise();
  }


  async add(patientpayment: Patientpayment): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/patientpayments', patientpayment).toPromise();
  }
}
