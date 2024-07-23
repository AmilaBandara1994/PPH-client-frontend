import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Clinicstatus} from "../entity/clinicstatus";
import {Familystatus} from "../entity/familystatus";

@Injectable({
  providedIn: 'root'
})
export class FamilystatusService {

  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Familystatus>> {
    const familystatus = await this.http.get<Array<Familystatus>>('http://localhost:8080/familystatuses/list').toPromise();
    if(familystatus == undefined){
      return [];
    }
    return familystatus;
  }
}
