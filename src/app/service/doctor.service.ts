import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Doctor} from "../entity/doctor";

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient) { }

  async getAllList(query:string): Promise<Array<Doctor>> {
    const doctor = await this.http.get<Array<Doctor>>('http://localhost:8080/doctors/list'+query).toPromise();
    if(doctor == undefined){
      return [];
    }
    return doctor;
  }

  async get(id:number): Promise<Doctor|undefined> {
    const doctor = await this.http.get<Doctor>('http://localhost:8080/doctors'+ id).toPromise();
    if(doctor == undefined){
      return undefined;
    }
    return doctor;
  }


  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/doctors/' + id).toPromise();
  }

  async update(doctor: Doctor): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/doctors', doctor).toPromise();
  }



  // async getAllListNameId(): Promise<Array<Employee>> {
  //
  //   const employees = await this.http.get<Array<Employee>>('http://localhost:8080/employees/list').toPromise();
  //   if(employees == undefined){
  //     return [];
  //   }
  //   return employees;
  // }

  async add(doctor: Doctor): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/doctors', doctor).toPromise();
  }
}
