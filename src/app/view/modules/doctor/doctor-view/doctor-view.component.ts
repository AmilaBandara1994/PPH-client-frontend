import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Doctor} from "../../../../entity/doctor";
import {Employee} from "../../../../entity/employee";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Gender} from "../../../../entity/gender";
import {Degree} from "../../../../entity/degree";
import {Doctordegree} from "../../../../entity/doctordegree";
import {Country} from "../../../../entity/country";
import {Doctorgrade} from "../../../../entity/doctorgrade";
import {UiAssist} from "../../../../util/ui/ui.assist";
import {MatSelectionList} from "@angular/material/list";
import {DoctorService} from "../../../../service/doctor.service";
import {EmployeeService} from "../../../../service/employeeservice";
import {CountryService} from "../../../../service/country.service";
import {DegreeService} from "../../../../service/degree.service";
import {DoctorgradeService} from "../../../../service/doctorgrade.service";
import {ClinictypeService} from "../../../../service/clinictype.service";
import {UniversityService} from "../../../../service/university.service";
import {GenderService} from "../../../../service/genderservice";
import {RegexService} from "../../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {Clinictype} from "../../../../entity/clinictype";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {Router} from "@angular/router";
import {MessageComponent} from "../../../../util/dialog/message/message.component";

@Component({
  selector: 'app-doctor-view',
  templateUrl: './doctor-view.component.html',
  styleUrls: ['./doctor-view.component.css']
})
export class DoctorViewComponent {
  columns: string[] = ['name', 'doctorgrade', 'ppr', 'gender', 'degrees', 'university' , 'slmcregno', 'mobile','modi'];
  headers: string[] = ['Name', 'Doctor Grade', 'Per Patient Rate', 'Gender', 'Degrees', 'University', 'SMLC Reg:NO', 'Mobile','Modification'];
  binders: string[] = ['employee.fullname', 'doctorgrade.name', 'perpatientrate', 'employee.gender.name', 'getDegree()', 'getUniversity()','slmcregno', 'employee.mobile','getModi()'];

  cscolumns: string[] = ['csname', 'csgrade', 'csgender',];
  csprompts: string[] = ['Search by Name', 'Search by Grade', 'Search by Gender'];


  public clinetsearch!: FormGroup;
  public serversearch!: FormGroup;
  public form!: FormGroup;

  doctor!: Doctor;
  olddoctor!: Doctor;

  selectedrow: any;
  doctors: Array<Doctor> = [];
  doctoremployees: Array<Employee> = [];
  data!: MatTableDataSource<Doctor>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  genders: Array<Gender> = [];
  degrees: Array<Degree> = [];
  doctordegrees: Array<Doctordegree> = [];
  countries: Array<Country> = [];
  clinictypes: Array<Degree> = [];
  doctorgrades: Array<Doctorgrade> = [];

  regexes: any;

  uiassist: UiAssist;

  @ViewChild('availablelist') availablelist!: MatSelectionList;
  @ViewChild('selectedlist') selectedlist!: MatSelectionList;

  constructor(
    private router: Router,
    private doctorss: DoctorService,
    private empservice: EmployeeService,
    private countryservice: CountryService,
    private degreeservice: DegreeService,
    private dgrades: DoctorgradeService,
    private cliniservice: ClinictypeService,
    private universityservice: UniversityService,
    private genderservice: GenderService,
    private rs: RegexService,
    private formb: FormBuilder,
    private dialog: MatDialog,
    private datep: DatePipe,
    public authService: AuthorizationManager
  ) {
    this.uiassist = new UiAssist(this);

    this.clinetsearch = this.formb.group({
      "csname": new FormControl(),
      "csgrade": new FormControl(),
      "csgender": new FormControl(),
    });
    this.serversearch = this.formb.group({
      "ssdoctorgrade": new FormControl(),
      "ssclinictype": new FormControl(),
      "ssdegree": new FormControl(),
    });
    this.form = this.formb.group({
      "doctorclinictypes": new FormControl('', [Validators.required]),
      "doctordegrees": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "slmcregno": new FormControl('', [Validators.required]),
      "doslmcregisterd": new FormControl('', [Validators.required]),
      "foreigntraining": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
      "doctorgrade": new FormControl('', [Validators.required]),
      "country": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.initialize();
  }

  initialize() {

    this.createView();

    this.genderservice.getAllList().then((gens: Gender[]) => {
      this.genders = gens;
    });
    this.empservice.getAll("?designationid=2").then((emp: Employee[]) => {
      this.doctoremployees = emp;
      // let employee = emp;
      // this.doctoremployees = emp.filter(em => {
      //    let doct = this.doctors.filter(doc => {
      //      doc.employee.id != em.id;
      //   });
      //    if(doct.length > 0){
      //      console.log('false');
      //      return false;
      //    }else{
      //      console.log('true');
      //      return true;
      //    }
      // });
    });
    this.countryservice.getAllList().then((country: Country[]) => {
      this.countries = country;
    });

    this.dgrades.getAllList().then((dess: Doctorgrade[]) => {
      this.doctorgrades = dess;
    });
    this.degreeservice.getAllList().then((degres: Degree[]) => {
      this.degrees = degres;
    });
    this.cliniservice.getAllList().then((clinictype: Clinictype[]) => {
      this.clinictypes = clinictype;
    });

    // this.doctorss.getAllList('')then((docs: Doctor[]) => {
    //   this.regexes = regs;
    //   this.createForm();
    // });

  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string) {

    this.doctorss.getAllList(query)
      .then((docs: Doctor[]) => {
        this.doctors = docs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.doctors);
        this.data.paginator = this.paginator;
      });

  }


  getModi(element: Doctor) {
    // element.doctordegrees.map(ele =>
  }
  getDegree(element: Doctor) {
    let degree = ""
    if(element.doctordegrees.length > 0){
      element.doctordegrees.map( element => {
        degree += ", " + element.degree.name;
      })
    }
    if( degree.charAt( 0 ) === ',' )
      degree = degree.slice( 1 );
    return degree;
  }
  getUniversity(element: Doctor) {
    let university = ""
    if(element.doctordegrees.length > 0){
      element.doctordegrees.map( element => {
        university += ", " + element.university.name;
      })
    }
    if( university.charAt( 0 ) === ',' )
      university = university.slice( 1 );
    return university;
  }
  filterTable(): void {

    const cserchdata = this.clinetsearch.getRawValue();


    this.data.filterPredicate = (doc: Doctor, filter: string) => {
      return (cserchdata.csgender == null || doc.employee.gender.name.toLowerCase().includes(cserchdata.csgender)) &&
        (cserchdata.csname == null || doc.employee.fullname.toLowerCase().includes(cserchdata.csname)) &&
        (cserchdata.csgrade == null || doc.doctorgrade.name.toLowerCase().includes(cserchdata.csgrade));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    const sserchdata = this.serversearch.getRawValue();

    let gradeid = sserchdata.ssdoctorgrade;
    let clinictypeid = sserchdata.ssclinictype;
    let degreeid = sserchdata.ssdegree;

    let query = "";

    if (gradeid != null) query = query + "&doctorgradeid=" + gradeid;
    if (clinictypeid != null) query = query + "&clinictypeid=" + clinictypeid;
    if (degreeid != null) query = query + "&degreeid=" + degreeid;

    if (query != "") query = query.replace(/^./, "?")

    this.loadTable(query);

  }

  btnSearchClearMc() {

    const confirm = this.dialog.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.serversearch.reset();
        this.loadTable("");
      }
    });
  }

  add() {

  }

  clear() {

  }

  update() {

  }

  delete(doctor:Doctor) {
    console.log(doctor)
    const confirm = this.dialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Clinic Delete",
        message: "Are you sure to Delete the Doctor ? <br> <br>" + doctor.employee.fullname
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.doctorss.delete(doctor.id).then((responce: [] | undefined) => {

          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        } ).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
            this.loadTable("");
          }

          const stsmsg = this.dialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Doctor Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });

  }


  rightSelected(): void {
    this.doctor.doctordegrees = this.availablelist.selectedOptions.selected.map(option => {
      // @ts-ignore
      const doctordegree = new Doctordegree(option);
      this.degrees = this.degrees.filter(degree => degree !== option.value); //Remove Selected
      this.doctordegrees.push(doctordegree); // Add selected to Right Side
      console.log(this.doctordegrees)
      return doctordegree;
    });

    this.form.controls["doctordegrees"].clearValidators();
    this.form.controls["doctordegrees"].updateValueAndValidity(); // Update status
  }

  leftSelected(): void {
//     const selectedOptions = this.selectedlist.selectedOptions.selected; // Right Side
//     for (const option of selectedOptions) {
//       const extUserRoles = option.value;
//       this.userroles = this.userroles.filter(role =>{
//         role !== extUserRoles
//       }); // Remove the Selected one From Right Side
//       this.roles.push(extUserRoles.role);
//     }
//
  }


  rightAll(): void {
//     this.user.userroles = this.availablelist.selectAll().map(option => {
//       const userRole = new Userrole(option.value);
//       this.roles = this.roles.filter(role => role !== option.value);
//       this.userroles.push(userRole);
//       return userRole;
//     });
//
//     this.form.controls["userroles"].clearValidators();
//     this.form.controls["userroles"].updateValueAndValidity();
  }

  leftAll():void{
//     for(let userrole of this.userroles) this.roles.push(userrole.role);
//     thi
  }

  viewDetails(doctor:Doctor) {
    this.router.navigateByUrl('main/doctors/details/'+doctor.id);
  }

  updateclinic(doctor:Doctor) {
    this.router.navigateByUrl('main/doctors/update/'+doctor.id);
  }
}
