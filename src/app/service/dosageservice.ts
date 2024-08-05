import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Dosage} from "../entity/dosage";

@Injectable({
  providedIn: 'root'
})
export class Dosageservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Dosage>> {
    const dosages = await this.http.get<Array<Dosage>>('http://localhost:8080/dosages/list').toPromise();
    if(dosages == undefined){
      return [];
    }
    return dosages;
  }
}
