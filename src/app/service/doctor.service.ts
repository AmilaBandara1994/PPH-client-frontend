import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Doctor} from "../entity/doctor";

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Doctor>> {
    const doctor = await this.http.get<Array<Doctor>>('http://localhost:8080/doctors').toPromise();
    if(doctor == undefined){
      return [];
    }
    return doctor;
  }
}
