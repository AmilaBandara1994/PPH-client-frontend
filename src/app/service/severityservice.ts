import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Severity} from "../entity/severity";

@Injectable({
  providedIn: 'root'
})
export class Severityservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Severity>> {
    const severities = await this.http.get<Array<Severity>>('http://localhost:8080/severities/list').toPromise();
    if(severities == undefined){
      return [];
    }
    return severities;
  }
}
