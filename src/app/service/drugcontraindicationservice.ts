import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Drugform} from "../entity/drugform";
import {Drugstatus} from "../entity/drugstatus";
import {Drugindication} from "../entity/drugindication";
import {Drugcontraindication} from "../entity/drugcontraindication";

@Injectable({
  providedIn: 'root'
})
export class Drugcontraindicationservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Drugcontraindication>> {
    const drugcontraindications = await this.http.get<Array<Drugcontraindication>>('http://localhost:8080/drugcontraindications/list').toPromise();
    if(drugcontraindications == undefined){
      return [];
    }
    return drugcontraindications;
  }
}
