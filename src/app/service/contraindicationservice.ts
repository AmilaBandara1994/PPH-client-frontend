import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Contraindication} from "../entity/contraindication";

@Injectable({
  providedIn: 'root'
})
export class Contraindicationservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Contraindication>> {
    const contraindications = await this.http.get<Array<Contraindication>>('http://localhost:8080/contraindications/list').toPromise();
    if(contraindications == undefined){
      return [];
    }
    return contraindications;
  }
}
