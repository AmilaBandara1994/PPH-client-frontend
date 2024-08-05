import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Diseasediagnosis} from "../entity/diseasediagnosis";

@Injectable({
  providedIn: 'root'
})
export class Diseasediagnosisservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Diseasediagnosis>> {
    const diseasediagnoses = await this.http.get<Array<Diseasediagnosis>>('http://localhost:8080/diseasediagnoses/list').toPromise();
    if(diseasediagnoses == undefined){
      return [];
    }
    return diseasediagnoses;
  }
}
