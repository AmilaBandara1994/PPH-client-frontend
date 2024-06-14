import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Clinictype} from "../entity/clinictype";

@Injectable({
  providedIn: 'root'
})
export class ClinictypeService {

  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Clinictype>> {
    const clinictype = await this.http.get<Array<Clinictype>>('http://localhost:8080/clinictypes/list').toPromise();
    if(clinictype == undefined){
      return [];
    }
    return clinictype;
  }
}
