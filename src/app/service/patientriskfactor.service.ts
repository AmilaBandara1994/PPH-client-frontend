import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Patientriskfactor} from "../entity/patientriskfactor";

@Injectable({
  providedIn: 'root'
})
export class PatientriskfactorService {

  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Patientriskfactor>> {
    const patientriskfactors = await this.http.get<Array<Patientriskfactor>>('http://localhost:8080/patientriskfactors/list').toPromise();
    if(patientriskfactors == undefined){
      return [];
    }
    return patientriskfactors;
  }
}
