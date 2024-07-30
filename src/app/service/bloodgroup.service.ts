import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Bloodgroup} from "../entity/bloodgroup";

@Injectable({
  providedIn: 'root'
})
export class BloodgroupService {

  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Bloodgroup>> {
    const bloodgroups = await this.http.get<Array<Bloodgroup>>('http://localhost:8080/bloodgroups/list').toPromise();
    if(bloodgroups == undefined){
      return [];
    }
    return bloodgroups;
  }
}
