import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Relationship} from "../entity/relationship";

@Injectable({
  providedIn: 'root'
})
export class RelationshipService {

  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Relationship>> {
    const relationships = await this.http.get<Array<Relationship>>('http://localhost:8080/relationships/list').toPromise();
    if(relationships == undefined){
      return [];
    }
    return relationships;
  }
}
