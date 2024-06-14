import {CountByDesignation} from "./entity/countbydesignation";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ClinicCountByClinictype} from "./entity/cliniccountbyclinictype";

@Injectable({
  providedIn: 'root'
})

export class ReportService {

  constructor(private http: HttpClient) {  }

  async countByDesignation(): Promise<Array<CountByDesignation>> {

    const countbydesignations = await this.http.get<Array<CountByDesignation>>('http://localhost:8080/reports/countbydesignation').toPromise();
    if(countbydesignations == undefined){
      return [];
    }
    return countbydesignations;
  }

  async cliniccountbyclinictype(): Promise<Array<ClinicCountByClinictype>> {

    const cliniccountby = await this.http.get<Array<ClinicCountByClinictype>>('http://localhost:8080/reports/cliniccountbyclinictype').toPromise();
    if(cliniccountby == undefined){
      return [];
    }
    return cliniccountby;
  }

}


