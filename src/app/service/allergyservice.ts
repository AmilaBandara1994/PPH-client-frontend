import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Allergy} from "../entity/allergy";

@Injectable({
  providedIn: 'root'
})
export class Allergyservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Allergy>> {
    const allergies = await this.http.get<Array<Allergy>>('http://localhost:8080/allergies/list').toPromise();
    if(allergies == undefined){
      return [];
    }
    return allergies;
  }
}
