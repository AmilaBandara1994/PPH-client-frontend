import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Clinicstatus} from "../entity/clinicstatus";
import {Province} from "../entity/province";

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Province>> {
    const provinces = await this.http.get<Array<Province>>('http://localhost:8080/provinces/list').toPromise();
    if(provinces == undefined){
      return [];
    }
    return provinces;
  }
}
