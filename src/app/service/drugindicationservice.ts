import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Drugform} from "../entity/drugform";
import {Drugstatus} from "../entity/drugstatus";
import {Drugindication} from "../entity/drugindication";

@Injectable({
  providedIn: 'root'
})
export class Drugindicationservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Drugindication>> {
    const drugindications = await this.http.get<Array<Drugindication>>('http://localhost:8080/drugindications/list').toPromise();
    if(drugindications == undefined){
      return [];
    }
    return drugindications;
  }
}
