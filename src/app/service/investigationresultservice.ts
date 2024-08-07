import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Investigationresult} from "../entity/investigationresult";

@Injectable({
  providedIn: 'root'
})
export class Investigationresultservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Investigationresult>> {
    const investigationresults = await this.http.get<Array<Investigationresult>>('http://localhost:8080/investigationresults/list').toPromise();
    if(investigationresults == undefined){
      return [];
    }
    return investigationresults;
  }
}
