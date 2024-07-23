import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Riskfactor} from "../entity/riskfactor";

@Injectable({
  providedIn: 'root'
})
export class RiskfactorsService {

  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Riskfactor>> {
    const riskfactors = await this.http.get<Array<Riskfactor>>('http://localhost:8080/riskfactors/list').toPromise();
    if(riskfactors == undefined){
      return [];
    }
    return riskfactors;
  }
}
