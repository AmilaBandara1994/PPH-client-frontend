import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Indication} from "../entity/indication";

@Injectable({
  providedIn: 'root'
})
export class Indicationservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Indication>> {
    const indications = await this.http.get<Array<Indication>>('http://localhost:8080/indications/list').toPromise();
    if(indications == undefined){
      return [];
    }
    return indications;
  }
}
