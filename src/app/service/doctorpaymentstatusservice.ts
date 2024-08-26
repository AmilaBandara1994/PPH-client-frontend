import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Doctorpaymentstatus} from "../entity/doctorpaymentstatus";

@Injectable({
  providedIn: 'root'
})
export class Doctorpaymentstatusservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Doctorpaymentstatus>> {
    const doctorpaymentstatuses = await this.http.get<Array<Doctorpaymentstatus>>('http://localhost:8080/doctorpaymentstatuses/list').toPromise();
    if(doctorpaymentstatuses == undefined){
      return [];
    }
    return doctorpaymentstatuses;
  }
}
