import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Bank} from "../entity/bank";

@Injectable({
  providedIn: 'root'
})
export class Bankservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Bank>> {
    const banks = await this.http.get<Array<Bank>>('http://localhost:8080/banks/list').toPromise();
    if(banks == undefined){
      return [];
    }
    return banks;
  }
}
