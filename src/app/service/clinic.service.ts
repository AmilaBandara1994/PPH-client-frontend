import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Clinic} from "../entity/clinic";

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

  constructor(private http: HttpClient) { }

  async getAll(query:string): Promise<Array<Clinic>> {
    const clinic = await this.http.get<Array<Clinic>>('http://localhost:8080/clinics'+query).toPromise();
    if(clinic == undefined){
      return [];
    }
    return clinic;
  }
}
