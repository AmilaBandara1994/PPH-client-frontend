import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Diagnosisstatus} from "../entity/diagnosisstatus";

@Injectable({
  providedIn: 'root'
})
export class Diagnosisstatusservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Diagnosisstatus>> {
    const diagnosisstatuses = await this.http.get<Array<Diagnosisstatus>>('http://localhost:8080/diagnosisstatuses/list').toPromise();
    if(diagnosisstatuses == undefined){
      return [];
    }
    return diagnosisstatuses;
  }
}
