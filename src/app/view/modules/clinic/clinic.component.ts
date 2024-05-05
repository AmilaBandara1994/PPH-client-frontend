import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Employee} from "../../../entity/employee";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Gender} from "../../../entity/gender";
import {Designation} from "../../../entity/designation";
import {Empstatus} from "../../../entity/empstatus";
import {Emptype} from "../../../entity/emptype";
import {Clinicstatus} from "../../../entity/clinicstatus";
import {Doctor} from "../../../entity/doctor";
import {Clinic} from "../../../entity/clinic";
import {Clinictype} from "../../../entity/clinictype";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {EmployeeService} from "../../../service/employeeservice";
import {GenderService} from "../../../service/genderservice";
import {DesignationService} from "../../../service/designationservice";
import {Empstatusservice} from "../../../service/empstatusservice";
import {Emptypeservice} from "../../../service/emptypeservice";
import {RegexService} from "../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {ClinicService} from "../../../service/clinic.service";

@Component({
  selector: 'app-clinic',
  templateUrl: './clinic.component.html',
  styleUrls: ['./clinic.component.css']
})
export class ClinicComponent {

  columns: string[] = ['clinictype', 'clinicstatus' ,'doctor', 'date', 'starttime', 'endtime', 'patientcount', 'modi'];
  headers: string[] = ['Clinic Type', 'Clinic Status', 'Doctor Name', 'Date', 'Start time','End Time', 'Patient Count' , 'Modification'];
  binders: string[] = ['clinictype.name', 'clinicstatus.name', 'doctor.name', 'date' ,'starttime', 'endtime','patientcount' , 'getModi()'];

  cscolumns: string[] = ['csnumber', 'cscallingname', 'csgender', 'csdesignation', 'csname', 'csmodi'];
  csprompts: string[] = ['Search by Number', 'Search by Name', 'Search by Gender',
    'Search by Designation', 'Search by Full Name', 'Search by Modi'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  data!: MatTableDataSource<Clinic>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'

  uiassist: UiAssist;


  clinics: Array<Clinic> = [];
  clinictypes: Array<Clinictype> = [];
  dctors: Array<Doctor> = [];
  clinicstatuses: Array<Clinicstatus> = [];

  constructor(    private cs: ClinicService,
                  private rs: RegexService,
                  private fb: FormBuilder,
                  private dg: MatDialog,
                  private dp: DatePipe,
                  public authService:AuthorizationManager) {
    this.uiassist  = new UiAssist(this);
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    // this.gs.getAllList().then((gens: Gender[]) => {
    //   this.genders = gens;
    // });



  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }


  loadTable(query: string) {

    this.cs.getAll(query)
      .then((clinic: Clinic[]) => {
        this.clinics = clinic;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.clinics);
        this.data.paginator = this.paginator;
      });

  }

  // getModi(element: Clinic ) {
  //   return element.number + '(' + element.callingname + ')';
  // }

  clear():void{
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Employee Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset()
      }
    });
  }

}
