import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Patientstatus} from "../entity/patientstatus";

@Injectable({
  providedIn: 'root'
})
export class PatientstatusService {

  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Patientstatus>> {
    const patientstatuses = await this.http.get<Array<Patientstatus>>('http://localhost:8080/patientstatuses/list').toPromise();
    if(patientstatuses == undefined){
      return [];
    }
    return patientstatuses;
  }
}
