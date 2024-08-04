import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Treatmentplan} from "../entity/treatmentplan";

@Injectable({
  providedIn: 'root'
})
export class Treatmentplanservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Treatmentplan>> {
    const treatmentplans = await this.http.get<Array<Treatmentplan>>('http://localhost:8080/treatmentplans/list').toPromise();
    if(treatmentplans == undefined){
      return [];
    }
    return treatmentplans;
  }
}
