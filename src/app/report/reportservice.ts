import {CountByDesignation} from "./entity/countbydesignation";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import {ClinicCountByClinictype} from "./entity/cliniccountbyclinictype";
import {Countbytreatmentplan} from "./entity/countbytreatmentplan";
import {PatientCountByBloodgroup} from "./entity/patientcountbybloodgroup";
import {DoctorCountBySpeciality} from "./entity/doctorcountbyspeciality";
import {DrugByBrandAndStstus} from "./entity/drugbybrandandststus";
import {PatientByClinics} from "./entity/patientbyclinics";
import {PatientByClinicByTime} from "./entity/patientbyclinicbytime";

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

  async countbytreatmentplan(): Promise<Array<Countbytreatmentplan>> {

    const countbytreatmentplan = await this.http.get<Array<Countbytreatmentplan>>('http://localhost:8080/reports/diagnosiscountbytreatmentplan').toPromise();
    if(countbytreatmentplan == undefined){
      return [];
    }
    return countbytreatmentplan;
  }


  async countByBloodgroup(): Promise<Array<PatientCountByBloodgroup>> {

    const patientcountbybloodgroups = await this.http.get<Array<PatientCountByBloodgroup>>('http://localhost:8080/reports/patientcountbybloodgroup').toPromise();
    if(patientcountbybloodgroups == undefined){
      return [];
    }
    return patientcountbybloodgroups;
  }

  async countBySpeciality(): Promise<Array<DoctorCountBySpeciality>> {

    const doctorcountbyspecialities = await this.http.get<Array<DoctorCountBySpeciality>>('http://localhost:8080/reports/doctorcountbyspeciality').toPromise();
    if(doctorcountbyspecialities == undefined){
      return [];
    }
    return doctorcountbyspecialities;
  }

  async getCountByDoctor(): Promise<number> {

    const doctorcount = await this.http.get<number>('http://localhost:8080/reports/doctorscount').toPromise();
    if(doctorcount == undefined){
      return 0;
    }
    return doctorcount;
  }

  async getScheduledClinicCount(): Promise<number> {

    const schdlclinics = await this.http.get<number>('http://localhost:8080/reports/scheduledclinics').toPromise();
    if(schdlclinics == undefined){
      return 0;
    }
    return schdlclinics;
  }

  async getCancelledClinicCount(): Promise<number> {

    const cnlclinics = await this.http.get<number>('http://localhost:8080/reports/cacelledclinics').toPromise();
    if(cnlclinics == undefined){
      return 0;
    }
    return cnlclinics;
  }

  async getAdmittedPatientsCount(): Promise<number> {

    const admittedpatients = await this.http.get<number>('http://localhost:8080/reports/admittedpatients').toPromise();
    if(admittedpatients == undefined){
      return 0;
    }
    return admittedpatients;
  }

  async getCriticalPatientsCount(): Promise<number> {

    const criticalpatients = await this.http.get<number>('http://localhost:8080/reports/criticalpatients').toPromise();
    if(criticalpatients == undefined){
      return 0;
    }
    return criticalpatients;
  }

  async getInProgressInvestigationsCount(): Promise<number> {

    const inprogressinves = await this.http.get<number>('http://localhost:8080/reports/inprogressinvestigations').toPromise();
    if(inprogressinves == undefined){
      return 0;
    }
    return inprogressinves;
  }

  async getdrugByBrandStatsu(): Promise<Array<DrugByBrandAndStstus>> {

    const drugsbybrandstatus = await this.http.get<Array<DrugByBrandAndStstus>>('http://localhost:8080/reports/drugsbybrandandstatus').toPromise();
    if(drugsbybrandstatus == undefined){
      return [];
    }
    return drugsbybrandstatus;
  }

  async getdrugByBrandGenericStatsu(query : string): Promise<Array<DrugByBrandAndStstus>> {

    const drugsbybrandstatus = await this.http.get<Array<DrugByBrandAndStstus>>('http://localhost:8080/reports/drugbybrandgenericstatus'+query).toPromise();
    if(drugsbybrandstatus == undefined){
      return [];
    }
    return drugsbybrandstatus;
  }

  async getPatientCountByClinics(): Promise<Array<PatientByClinics>> {

    const patientsbyclinics = await this.http.get<Array<PatientByClinics>>('http://localhost:8080/reports/patientbyclinics').toPromise();
    if(patientsbyclinics == undefined){
      return [];
    }
    return patientsbyclinics;
  }

  async getPatientByClinicByTime(query : string): Promise<Array<PatientByClinicByTime>> {

    const patientbyclinicbytime = await this.http.get<Array<PatientByClinicByTime>>('http://localhost:8080/reports/patientbyclinicbytime' + query).toPromise();
    if(patientbyclinicbytime == undefined){
      return [];
    }
    return patientbyclinicbytime;
  }

}


