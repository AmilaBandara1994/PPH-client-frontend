import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Degree} from "../entity/degree";

@Injectable({
  providedIn: 'root'
})
export class DegreeService {

  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Degree>> {
    const degrees = await this.http.get<Array<Degree>>('http://localhost:8080/degrees/list').toPromise();
    if(degrees == undefined){
      return [];
    }
    return degrees;
  }
}
