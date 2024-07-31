import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Appointment} from "../entity/appointment";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  async getAll(query:string): Promise<Array<Appointment>> {
    const appointments = await this.http.get<Array<Appointment>>('http://localhost:8080/appointments/list'+query).toPromise();
    if(appointments == undefined){
      return [];
    }
    return appointments;
  }

  async getallBypatientId(id:number): Promise<Array<Appointment>> {
    const appointments = await this.http.get<Array<Appointment>>('http://localhost:8080/appointments/patientid/'+id).toPromise();
    if(appointments == undefined){
      return [];
    }
    return appointments;
  }


  async get(id:number): Promise<Appointment|undefined> {
    const appointment = await this.http.get<Appointment>('http://localhost:8080/appointments/details/'+ id).toPromise();
    if(appointment == undefined){
      return undefined;
    }
    return appointment;
  }

  async getcount(id:number): Promise<number> {
    const countbyclinic = await this.http.get<number>('http://localhost:8080/appointments/countbyclinic/'+ id).toPromise();
    if(countbyclinic == undefined){
      return 0;
    }
    return countbyclinic;
  }


  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/appointments/' + id).toPromise();
  }

  async update(appointment: Appointment): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/appointments', appointment).toPromise();
  }


  async add(appointment: Appointment): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/appointments', appointment).toPromise();
  }
}
