import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Disease} from "../entity/disease";

@Injectable({
  providedIn: 'root'
})
export class Diseaseservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Disease>> {
    const diseases = await this.http.get<Array<Disease>>('http://localhost:8080/diseases/list').toPromise();
    if(diseases == undefined){
      return [];
    }
    return diseases;
  }
}
