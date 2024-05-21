import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Clinic} from "../entity/clinic";
import {Employee} from "../entity/employee";

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

  async add(clinic: Clinic): Promise<[]|undefined>{
    console.log("Employee Adding-"+JSON.stringify(clinic));
    //employee.number="47457";
    return this.http.post<[]>('http://localhost:8080/clinics', clinic).toPromise();
  }
}
