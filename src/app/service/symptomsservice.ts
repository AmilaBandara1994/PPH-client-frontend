import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Symptoms} from "../entity/symptoms";

@Injectable({
  providedIn: 'root'
})
export class Symptomsservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Symptoms>> {
    const symptoms = await this.http.get<Array<Symptoms>>('http://localhost:8080/symptoms/list').toPromise();
    if(symptoms == undefined){
      return [];
    }
    return symptoms;
  }
}
