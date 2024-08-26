import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Clinic} from "../entity/clinic";

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

  constructor(private http: HttpClient) { }

  async get(id:number): Promise<Clinic | undefined> {
    return await this.http.get<Clinic>('http://localhost:8080/clinics/' + id).toPromise();
  }

  async getAll(query:string): Promise<Array<Clinic>> {
    const clinic = await this.http.get<Array<Clinic>>('http://localhost:8080/clinics'+query).toPromise();
    if(clinic == undefined){
      return [];
    }
    return clinic;
  }

  async getlatest(): Promise<Array<Clinic>> {
    const clinic = await this.http.get<Array<Clinic>>('http://localhost:8080/clinics/latest').toPromise();
    if(clinic == undefined){
      return [];
    }
    return clinic;
  }

  async getAllScheduled(query:string): Promise<Array<Clinic>> {
    const clinic = await this.http.get<Array<Clinic>>('http://localhost:8080/clinics/scheduled'+query).toPromise();
    if(clinic == undefined){
      return [];
    }
    return clinic;
  }


  async add(clinic: Clinic): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/clinics', clinic).toPromise();
  }

  async update(clinic: Clinic): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/clinics', clinic).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/clinics/' + id).toPromise();
  }

}
