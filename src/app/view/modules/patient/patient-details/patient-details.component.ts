import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {Patient} from "../../../../entity/patient";
import {Patientservice} from "../../../../service/patientservice";
import {Diagnosis} from "../../../../entity/diagnosis";

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent {

  patient!: Patient;
  id!: number ;
  imagediagnosispurl: string ="assets/my-img/banner/diagnosis-bg.jpg";

  age!:number;

  constructor(
    private ps:Patientservice,
    private arouter:ActivatedRoute,
    private _location: Location,
    private router: Router,

  ) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.id = this.arouter.snapshot.params['id'];

    this.initialize();


  }
  initialize() {
    // @ts-ignore
    this.ps.get(this.id).then((patient: Patient) => {
      console.log(patient)
      this.patient = patient
      this.getage(patient);
    });

  }

  getage(patient:Patient){
    let date:Date = new Date(patient.dob);
    let timeDiff = Math.abs(Date.now() - date.getTime());
    this.age = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
  }

  backtoview() {
    this._location.back();
  }

  updateform() {
    this.router.navigateByUrl('main/doctors/update/'+this.id);
  }
}
