import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Appointmentstatus} from "../entity/appointmentstatus";
import {Appointmenttype} from "../entity/appointmenttype";

@Injectable({
  providedIn: 'root'
})
export class AppointmenttypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Appointmenttype>> {
    const appointmenttypes = await this.http.get<Array<Appointmenttype>>('http://localhost:8080/appointmenttypes/list').toPromise();
    if(appointmenttypes == undefined){
      return [];
    }
    return appointmenttypes;
  }
}
