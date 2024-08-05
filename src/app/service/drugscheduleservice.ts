import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Drugschedule} from "../entity/drugschedule";

@Injectable({
  providedIn: 'root'
})
export class Drugscheduleservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Drugschedule>> {
    const drugschedules = await this.http.get<Array<Drugschedule>>('http://localhost:8080/drugschedules/list').toPromise();
    if(drugschedules == undefined){
      return [];
    }
    return drugschedules;
  }
}
