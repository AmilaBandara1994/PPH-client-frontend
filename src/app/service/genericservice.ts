import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Generic} from "../entity/generic";

@Injectable({
  providedIn: 'root'
})
export class Genericservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Generic>> {
    const generics = await this.http.get<Array<Generic>>('http://localhost:8080/generics/list').toPromise();
    if(generics == undefined){
      return [];
    }
    return generics;
  }
}
