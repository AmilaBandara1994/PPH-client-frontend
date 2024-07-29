import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Patient} from "../entity/patient";
import {Doctor} from "../entity/doctor";

@Injectable({
  providedIn: 'root'
})

export class Patientservice {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/patients/' + id).toPromise();
  }

  async update(patient: Patient): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/patients', patient).toPromise();
  }


  async getAll(query:string): Promise<Array<Patient>> {
    const patients = await this.http.get<Array<Patient>>('http://localhost:8080/patients'+query).toPromise();
    if(patients == undefined){
      return [];
    }
    return patients;
  }

  async get(id:number): Promise<Patient|undefined> {
    const patient = await this.http.get<Patient>('http://localhost:8080/patients/details/'+ id).toPromise();
    if(patient == undefined){
      return undefined;
    }
    return patient;
  }

  // async getAllListNameId(): Promise<Array<Employee>> {
  //
  //   const employees = await this.http.get<Array<Employee>>('http://localhost:8080/employees/list').toPromise();
  //   if(employees == undefined){
  //     return [];
  //   }
  //   return employees;
  // }
  //
  async add(patient: Patient): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/patients', patient).toPromise();
  }

}


