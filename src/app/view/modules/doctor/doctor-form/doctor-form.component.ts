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
import {DatePipe, Location} from "@angular/common";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {Clinictype} from "../../../../entity/clinictype";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {University} from "../../../../entity/university";
import {UiAssist} from "../../../../util/ui/ui.assist";

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.css']
})
export class DoctorFormComponent {

  incolumns: string[] = ['degree', 'year', 'university', 'remove'];
  inheaders: string[] = ['Degree', 'Year', 'University', 'Remove',];
  inbinders: string[] = ['degree.name', 'year', 'university.name', 'getBtn()'];
  public form!: FormGroup;
  public eduform!: FormGroup;
  // public innerform!: FormGroup;

  newdoctor!: Doctor;
  olddoctor!: Doctor;

  regexes: any;
  updatForm:boolean = false;
  id!: number ;
  ddid:number = 0;
  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  selectedrow: any;

  innerdata: any;
  oldinnerdata:any;
  doctordegrees: Array<Doctordegree> = [];
  indata!: MatTableDataSource<Doctordegree>

  uiassist: UiAssist;
  doctors: Array<Doctor> = [];
  doctoremployees: Array<Employee> = [];
  data!: MatTableDataSource<Doctor>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;




  genders: Array<Gender> = [];
  degrees: Array<Degree> = [];
  countries: Array<Country> = [];
  clinictypes: Array<Degree> = [];
  universities: Array<University> = [];
  doctorgrades: Array<Doctorgrade> = [];


  constructor(
    private doctorss: DoctorService,
    private empservice: EmployeeService,
    private _location: Location,
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


    this.eduform = this.formb.group({
      "year": new FormControl('', [Validators.required]),
      "degree": new FormControl('', [Validators.required]),
      // "educountry": new FormControl('', [Validators.required]),
      "university": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});


    this.form = this.formb.group({
      "doctordegrees": new FormControl(),
      "description": new FormControl('', [Validators.required]),
      "slmcregno": new FormControl('', [Validators.required]),
      "doslmcregistered": new FormControl('', [Validators.required]),
      "foreigntraining": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
      "doctorgrade": new FormControl('', [Validators.required]),
      "country": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {


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

    this.universityservice.getAllList().then((uni: University[]) => {
      this.universities = uni;
    });

    // this.doctorss.getAllList('')then((docs: Doctor[]) => {
    //   this.regexes = regs;
    //   this.createForm();
    // });

  }


  createView() {
    this.imageurl = 'assets/pending.gif';
    // this.loadTable("");
  }

  // createForm() {
  //
  //   this.innerform.controls['year'].setValidators([Validators.required]);
  //   this.innerform.controls['degree'].setValidators([Validators.required]);
  //   this.innerform.controls['university'].setValidators([Validators.required]);
  //
  //
  //   Object.values(this.form.controls).forEach(control => {
  //     control.markAsTouched();
  //   });
  //
  //   for (const controlName in this.form.controls) {
  //     const control = this.form.controls[controlName];
  //     control.valueChanges.subscribe(value => {
  //         // @ts-ignore
  //         if (controlName == "date" || controlName == "date")
  //           value = this.dp.transform(new Date(value), 'yyyy-MM-dd');
  //
  //         if (this.oldpurorder != undefined && control.valid) {
  //           // @ts-ignore
  //           if (value === this.purorder[controlName]) {
  //             control.markAsPristine();
  //           } else {
  //             control.markAsDirty();
  //           }
  //         } else {
  //           control.markAsPristine();
  //         }
  //       }
  //     );
  //
  //   }
  //
  //   // this.enableButtons(true, false, false);
  // }


  // loadTable(query: string) {
  //
  //   this.pos.getAll(query)
  //     .then((emps: Purorder[]) => {
  //       this.purorders = emps;
  //       this.imageurl = 'assets/fullfilled.png';
  //     })
  //     .catch((error) => {
  //       this.imageurl = 'assets/rejected.png';
  //     })
  //     .finally(() => {
  //       this.data = new MatTableDataSource(this.doctordegrees);
  //       this.data.paginator = this.paginator;
  //     });
  //
  // }

  btnaddMc() {

    this.innerdata = this.eduform.getRawValue();
    // console.log(this.innerdata);
    console.log(this.innerdata);

    if (this.innerdata != null) {

      // let explinetotal =this.innerdata.qty * this.innerdata.explinetotal;
      // @ts-ignore
      let poitem = new Doctordegree();
        poitem.year = this.innerdata.year;
        poitem.university = this.innerdata.university;
        poitem.degree = this.innerdata.degree;

      let tem: Doctordegree[] = [];
      if (this.indata != null) this.indata.data.forEach((i) => tem.push(i));

      this.doctordegrees = [];
      tem.forEach((t) => this.doctordegrees.push(t));

      this.doctordegrees.push(poitem);
      this.indata = new MatTableDataSource(this.doctordegrees);

      // this.ddid++;
      this.eduform.reset();

    }

  }

  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  filterDates = (date: Date | null): boolean => {
    const currentDate = new Date();
    return !date || date.getTime() <= currentDate.getTime();
  };



  add() {
    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Clinic Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.newdoctor = this.form.getRawValue();
      // @ts-ignore
      this.newdoctor.doslmcregisterd = this.datep.transform( this.newdoctor.doslmcregisterd, 'yyyy-MM-dd');
      // @ts-ignore

      this.newdoctor.doctordegrees = this.doctordegrees;

      let doctor: string = "";

      doctor = doctor + "<br>Name  is : " + this.newdoctor.employee.fullname;
      // clinic = clinic + "<br>Doctor Name is : " + this.newdoctor.doctor.employee.fullname;
      doctor = doctor + "<br>Doctor Grade is : " + this.newdoctor.doctorgrade.name;
      doctor = doctor + "<br>SLMC register No : " + this.newdoctor.slmcregno;
      doctor = doctor + "<br>SLMC Reg Date is : " + this.newdoctor.doslmcregisterd;
      const confirm = this.dialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Doctor Add",
          message: "Are you sure to Add the following Doctor data? <br> <br>" + doctor
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.doctorss.add(this.newdoctor).then((responce: [] | undefined) => {

            if (responce != undefined) { // @ts-ignore
              console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              // @ts-ignore
              addstatus = responce['errors'] == "";
              console.log("Add Sta-" + addstatus);
              if (!addstatus) { // @ts-ignore
                addmessage = responce['errors'];
              }
            } else {
              console.log("undefined");
              addstatus = false;
              addmessage = "Content Not Found"
            }
          }).finally(() => {

            if (addstatus) {
              addmessage = "Successfully Saved";
              this.form.reset();
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
            }

            const stsmsg = this.dialog.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status - Doctor Add", message: addmessage}
            });

            stsmsg.afterClosed().subscribe(async result => {
              if (!result) {
                return;
              }
            });
          });
        }
      });
    }
  }

  update() {

  }

  delete() {

  }

  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) {

        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }

    return errors;
  }

  clear():void{
    const confirm = this.dialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Doctor Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset();
      }
    });
  }

  backtoview() {
    this._location.back();
  }

  eduadd() {
    let uni:Doctordegree;
    uni = this.form.getRawValue();
    console.log(uni);
    this.doctordegrees.push(uni);
    this.eduform.reset()
  }

  educlear() {
    this.eduform.reset();
  }

  deleteRaw(x: any) {

    let datasources = this.indata.data

    const index = datasources.findIndex(m => m.id === x.id);
    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.doctordegrees = this.indata.data;

  }
}
