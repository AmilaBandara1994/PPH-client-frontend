import {Employee} from "../entity/employee";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Gender} from "../entity/gender";
import {Family} from "../entity/family";

@Injectable({
  providedIn: 'root'
})

export class Familyservice {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/families/' + id).toPromise();
  }

  async update(family: Family): Promise<[]|undefined>{
    //console.log("Employee Updating-"+employee.id);
    return this.http.put<[]>('http://localhost:8080/families', family).toPromise();
  }


  async getAll(query:string): Promise<Array<Family>> {
    const families = await this.http.get<Array<Family>>('http://localhost:8080/families'+query).toPromise();
    if(families == undefined){
      return [];
    }
    return families;
  }

  // async getAllListNameId(): Promise<Array<Employee>> {
  //
  //   const employees = await this.http.get<Array<Employee>>('http://localhost:8080/employees/list').toPromise();
  //   if(employees == undefined){
  //     return [];
  //   }
  //   return employees;
  // }

  async add(family: Family): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/families', family).toPromise();
  }

}


