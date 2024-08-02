import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Drugroute} from "../entity/drugroute";

@Injectable({
  providedIn: 'root'
})
export class Drugrouteservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Drugroute>> {
    const drugroutes = await this.http.get<Array<Drugroute>>('http://localhost:8080/drugroutes/list').toPromise();
    if(drugroutes == undefined){
      return [];
    }
    return drugroutes;
  }
}
