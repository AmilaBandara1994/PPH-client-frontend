import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Clinicstatus} from "../entity/clinicstatus";

@Injectable({
  providedIn: 'root'
})
export class ClinicstatusService {

  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Clinicstatus>> {
    const clinicstatus = await this.http.get<Array<Clinicstatus>>('http://localhost:8080/clinicstatuses/list').toPromise();
    if(clinicstatus == undefined){
      return [];
    }
    return clinicstatus;
  }
}
