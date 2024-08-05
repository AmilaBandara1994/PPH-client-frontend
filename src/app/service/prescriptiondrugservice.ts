import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Prescriptiondrug} from "../entity/prescriptiondrug";

@Injectable({
  providedIn: 'root'
})
export class Prescriptiondrugservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Prescriptiondrug>> {
    const prescriptiondrugs = await this.http.get<Array<Prescriptiondrug>>('http://localhost:8080/prescriptiondrugs/list').toPromise();
    if(prescriptiondrugs == undefined){
      return [];
    }
    return prescriptiondrugs;
  }
}
