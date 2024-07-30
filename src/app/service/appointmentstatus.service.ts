import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Appointmentstatus} from "../entity/appointmentstatus";

@Injectable({
  providedIn: 'root'
})
export class AppointmentstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Appointmentstatus>> {
    const appointmetstatuses = await this.http.get<Array<Appointmentstatus>>('http://localhost:8080/appointmentstatuses/list').toPromise();
    if(appointmetstatuses == undefined){
      return [];
    }
    return appointmetstatuses;
  }
}
