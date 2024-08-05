import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Symptomsdiagnosis} from "../entity/symptomsdiagnosis";

@Injectable({
  providedIn: 'root'
})
export class Symptomsdiagnosisservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Symptomsdiagnosis>> {
    const symptomsdiagnoses = await this.http.get<Array<Symptomsdiagnosis>>('http://localhost:8080/symptomsdiagnoses/list').toPromise();
    if(symptomsdiagnoses == undefined){
      return [];
    }
    return symptomsdiagnoses;
  }
}
