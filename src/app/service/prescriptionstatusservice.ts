import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Prescriptionstatus} from "../entity/prescriptionstatus";

@Injectable({
  providedIn: 'root'
})
export class Prescriptionstatusservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Prescriptionstatus>> {
    const prescriptionstatuss = await this.http.get<Array<Prescriptionstatus>>('http://localhost:8080/prescriptionstatuses/list').toPromise();
    if(prescriptionstatuss == undefined){
      return [];
    }
    return prescriptionstatuss;
  }
}
