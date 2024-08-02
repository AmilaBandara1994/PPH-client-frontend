import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Drugform} from "../entity/drugform";

@Injectable({
  providedIn: 'root'
})
export class Drugformservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Drugform>> {
    const drugforms = await this.http.get<Array<Drugform>>('http://localhost:8080/drugforms/list').toPromise();
    if(drugforms == undefined){
      return [];
    }
    return drugforms;
  }
}
