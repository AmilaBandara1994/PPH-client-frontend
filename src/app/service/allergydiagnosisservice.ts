import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Allergydiagnosis} from "../entity/allergydiagnosis";

@Injectable({
  providedIn: 'root'
})
export class Allergydiagnosisservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Allergydiagnosis>> {
    const allergydiagnosises = await this.http.get<Array<Allergydiagnosis>>('http://localhost:8080/allergydiagnoses/list').toPromise();
    if(allergydiagnosises == undefined){
      return [];
    }
    return allergydiagnosises;
  }
}
