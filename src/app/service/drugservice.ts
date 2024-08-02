import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Drug} from "../entity/drug";

@Injectable({
  providedIn: 'root'
})
export class Drugservice {

  constructor(private http: HttpClient) { }

  async getAll(query:string): Promise<Array<Drug>> {
    const drugs = await this.http.get<Array<Drug>>('http://localhost:8080/drugs/list'+query).toPromise();
    if(drugs == undefined){
      return [];
    }
    return drugs;
  }

  async getallBypatientId(id:number): Promise<Array<Drug>> {
    const drugs = await this.http.get<Array<Drug>>('http://localhost:8080/drugs/patientid/'+id).toPromise();
    if(drugs == undefined){
      return [];
    }
    return drugs;
  }


  async get(id:number): Promise<Drug|undefined> {
    const drug = await this.http.get<Drug>('http://localhost:8080/drugs/details/'+ id).toPromise();
    if(drug == undefined){
      return undefined;
    }
    return drug;
  }

  async getcount(id:number): Promise<number> {
    const countbyclinic = await this.http.get<number>('http://localhost:8080/drugs/countbyclinic/'+ id).toPromise();
    if(countbyclinic == undefined){
      return 0;
    }
    return countbyclinic;
  }


  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/drugs/' + id).toPromise();
  }

  async update(drug: Drug): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/drugs', drug).toPromise();
  }


  async add(drug: Drug): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/drugs', drug).toPromise();
  }
}
