import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Prescription} from "../entity/prescription";

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  constructor(private http: HttpClient) { }

  async getAll(query:string): Promise<Array<Prescription>> {
    const prescriptions = await this.http.get<Array<Prescription>>('http://localhost:8080/prescriptions/list'+query).toPromise();
    if(prescriptions == undefined){
      return [];
    }
    return prescriptions;
  }

  async getallBypatientId(id:number): Promise<Array<Prescription>> {
    const prescriptions = await this.http.get<Array<Prescription>>('http://localhost:8080/prescriptions/patientid/'+id).toPromise();
    if(prescriptions == undefined){
      return [];
    }
    return prescriptions;
  }


  async get(id:number): Promise<Prescription|undefined> {
    const prescription = await this.http.get<Prescription>('http://localhost:8080/prescriptions/details/'+ id).toPromise();
    if(prescription == undefined){
      return undefined;
    }
    return prescription;
  }

  async getcount(id:number): Promise<number> {
    const countbyclinic = await this.http.get<number>('http://localhost:8080/prescriptions/countbyclinic/'+ id).toPromise();
    if(countbyclinic == undefined){
      return 0;
    }
    return countbyclinic;
  }


  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/prescriptions/' + id).toPromise();
  }

  async update(prescription: Prescription): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/prescriptions', prescription).toPromise();
  }


  async add(prescription: Prescription): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/prescriptions', prescription).toPromise();
  }
}
