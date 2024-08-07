import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Reporttype} from "../entity/reporttype";

@Injectable({
  providedIn: 'root'
})
export class Reporttypeservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Reporttype>> {
    const reporttypes = await this.http.get<Array<Reporttype>>('http://localhost:8080/reporttypes/list').toPromise();
    if(reporttypes == undefined){
      return [];
    }
    return reporttypes;
  }
}
