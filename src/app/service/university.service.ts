import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {University} from "../entity/university";

@Injectable({
  providedIn: 'root'
})
export class UniversityService {

  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<University>> {
    const universities = await this.http.get<Array<University>>('http://localhost:8080/universities/list').toPromise();
    if(universities == undefined){
      return [];
    }
    return universities;
  }
}
