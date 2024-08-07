import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Investigation} from "../entity/investigation";

@Injectable({
  providedIn: 'root'
})
export class InvestigationService {

  constructor(private http: HttpClient) { }

  async getAll(query:string): Promise<Array<Investigation>> {
    const investigations = await this.http.get<Array<Investigation>>('http://localhost:8080/investigations/list'+query).toPromise();
    if(investigations == undefined){
      return [];
    }
    return investigations;
  }

  async getallBypatientId(id:number): Promise<Array<Investigation>> {
    const investigations = await this.http.get<Array<Investigation>>('http://localhost:8080/investigations/patientid/'+id).toPromise();
    if(investigations == undefined){
      return [];
    }
    return investigations;
  }


  async get(id:number): Promise<Investigation|undefined> {
    const investigation = await this.http.get<Investigation>('http://localhost:8080/investigations/details/'+ id).toPromise();
    if(investigation == undefined){
      return undefined;
    }
    return investigation;
  }

  async getcount(id:number): Promise<number> {
    const countbyclinic = await this.http.get<number>('http://localhost:8080/investigations/countbyclinic/'+ id).toPromise();
    if(countbyclinic == undefined){
      return 0;
    }
    return countbyclinic;
  }


  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/investigations/' + id).toPromise();
  }

  async update(investigation: Investigation): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/investigations', investigation).toPromise();
  }


  async add(investigation: Investigation): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/investigations', investigation).toPromise();
  }
}
