import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Investigationstatus} from "../entity/investigationstatus";

@Injectable({
  providedIn: 'root'
})
export class Investigationstatusservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Investigationstatus>> {
    const investigationstatuses = await this.http.get<Array<Investigationstatus>>('http://localhost:8080/investigationstatuses/list').toPromise();
    if(investigationstatuses == undefined){
      return [];
    }
    return investigationstatuses;
  }
}
