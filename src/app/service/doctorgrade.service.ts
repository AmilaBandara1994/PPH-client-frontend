import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Doctorgrade} from "../entity/doctorgrade";

@Injectable({
  providedIn: 'root'
})
export class DoctorgradeService {

  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Doctorgrade>> {
    const doctorgrades = await this.http.get<Array<Doctorgrade>>('http://localhost:8080/doctorgrades/list').toPromise();
    if(doctorgrades == undefined){
      return [];
    }
    return doctorgrades;
  }
}
