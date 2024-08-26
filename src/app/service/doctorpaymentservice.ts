import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Doctorpayment} from "../entity/doctorpayment";

@Injectable({
  providedIn: 'root'
})
export class DoctorpaymentService {

  constructor(private http: HttpClient) { }

  async getAll(query:string): Promise<Array<Doctorpayment>> {
    const doctorpayments = await this.http.get<Array<Doctorpayment>>('http://localhost:8080/doctorpayments/list'+query).toPromise();
    if(doctorpayments == undefined){
      return [];
    }
    return doctorpayments;
  }

  async getallBypatientId(id:number): Promise<Array<Doctorpayment>> {
    const doctorpayments = await this.http.get<Array<Doctorpayment>>('http://localhost:8080/doctorpayments/patientid/'+id).toPromise();
    if(doctorpayments == undefined){
      return [];
    }
    return doctorpayments;
  }


  async get(id:number): Promise<Doctorpayment|undefined> {
    const doctorpayment = await this.http.get<Doctorpayment>('http://localhost:8080/doctorpayments/details/'+ id).toPromise();
    if(doctorpayment == undefined){
      return undefined;
    }
    return doctorpayment;
  }

  async getcount(id:number): Promise<number> {
    const countbyclinic = await this.http.get<number>('http://localhost:8080/doctorpayments/countbyclinic/'+ id).toPromise();
    if(countbyclinic == undefined){
      return 0;
    }
    return countbyclinic;
  }


  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/doctorpayments/' + id).toPromise();
  }

  async update(doctorpayment: Doctorpayment): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/doctorpayments', doctorpayment).toPromise();
  }


  async add(doctorpayment: Doctorpayment): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/doctorpayments', doctorpayment).toPromise();
  }
}
