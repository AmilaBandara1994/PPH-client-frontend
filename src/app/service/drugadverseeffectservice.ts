import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Drugform} from "../entity/drugform";
import {Drugstatus} from "../entity/drugstatus";
import {Drugindication} from "../entity/drugindication";
import {Drugadverseeffect} from "../entity/drugadverseeffect";

@Injectable({
  providedIn: 'root'
})
export class Drugadverseeffectservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Drugadverseeffect>> {
    const drugadverseeffects = await this.http.get<Array<Drugadverseeffect>>('http://localhost:8080/drugadverseeffects/list').toPromise();
    if(drugadverseeffects == undefined){
      return [];
    }
    return drugadverseeffects;
  }
}
