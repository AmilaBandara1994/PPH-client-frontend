import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Paytype} from "../entity/paytype";

@Injectable({
  providedIn: 'root'
})
export class PaytypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Paytype>> {
    const paytypes = await this.http.get<Array<Paytype>>('http://localhost:8080/paytypes/list').toPromise();
    if(paytypes == undefined){
      return [];
    }
    return paytypes;
  }
}
