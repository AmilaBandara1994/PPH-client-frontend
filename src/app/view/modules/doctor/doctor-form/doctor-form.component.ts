import {Component, Input, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Doctor} from "../../../../entity/doctor";
import {Employee} from "../../../../entity/employee";
import {MatTableDataSource} from "@angular/material/table";
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
import {ActivatedRoute} from "@angular/router";
import {MatSelectionList} from "@angular/material/list";
import {Doctorclinictype} from "../../../../entity/doctorclinictype";

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.css']
})
export class DoctorFormComponent {

  incolumns: string[] = ['degree', 'year', 'university', 'remove'];
  inheaders: string[] = ['Degree', 'Year', 'University', 'Remove',];
  inbinders: string[] = ['degree.name', 'year', 'university.name', 'getBtn()'];


  today=new Date();

  title:string='Doctor'

  public form!: FormGroup;
  public innerform!: FormGroup;
  updateForm: boolean = false;
  id!: number ;

  newdoctor!: Doctor;
  olddoctor!: Doctor;

  regexes: any;

  innerdata: any;
  doctordegrees: Array<Doctordegree> = [];
  indata!: MatTableDataSource<Doctordegree>
  uiassist: UiAssist;

  doctors: Array<Doctor> = [];
  doctoremployees: Array<Employee> = [];
  data!: MatTableDataSource<Doctor>;
  imageurl: string = '';

  doctorclinictypes: Array<Doctorclinictype> = [];

  @Input() clinictypes: Array<Clinictype> = [];
  oldclinictypes: Array<Clinictype> = [];

  @ViewChild('availablelist') availablelist!: MatSelectionList;
  @ViewChild('selectedlist') selectedlist!: MatSelectionList;


  genders: Array<Gender> = [];
  degrees: Array<Degree> = [];
  countries: Array<Country> = [];
  universities: Array<University> = [];
  doctorgrades: Array<Doctorgrade> = [];
  employees: Array<Employee> = [];


  constructor(
    private doctorss: DoctorService,
    private empservice: EmployeeService,

    private countryservice: CountryService,
    private degreeservice: DegreeService,
    private dgrades: DoctorgradeService,
    private cliniservice: ClinictypeService,
    private universityservice: UniversityService,
    private genderservice: GenderService,

    private rs: RegexService,
    private arouter: ActivatedRoute,
    private _location: Location,
    private formb: FormBuilder,
    private dialog: MatDialog,
    private datep: DatePipe,
    public authService: AuthorizationManager
  ) {
    this.uiassist = new UiAssist(this);


    this.innerform = this.formb.group({
      "year": new FormControl('', [Validators.required]),
      "degree": new FormControl('', [Validators.required]),
      // "educountry": new FormControl('', [Validators.required]),
      "university": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});


    this.form = this.formb.group({
      "doctordegrees": new FormControl(),
      "description": new FormControl('', []),
      "slmcregno": new FormControl('', [Validators.required]),
      "doslmcregisterd": new FormControl('', [Validators.required]),
      "foreigntraining": new FormControl('', []),
      "employee": new FormControl('', [Validators.required]),
      "doctorgrade": new FormControl('', [Validators.required]),
      "country": new FormControl('', []),
      "perpatientrate": new FormControl('', []),

      "doctorclinictype": new FormControl(),

    }, {updateOn: 'change'});

  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.initialize();

    this.id = this.arouter.snapshot.params['id'];
    if (this.arouter.snapshot.params['id']) {

      this.doctorss.get(this.id).then((doctor: Doctor | undefined) => {
        if (doctor != undefined) {
          this.olddoctor = doctor;
          this.newdoctor = doctor;
        }
        console.log(doctor);
        this.updateForm = true;
        this.fillForm();
      });
    }


  }

  initialize() {


    this.genderservice.getAllList().then((gens: Gender[]) => {
      this.genders = gens;
    });
    this.empservice.getAllDoctors().then((emp: Employee[]) => {
      this.doctoremployees = emp;
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
    this.empservice.getAll('').then((ems: Employee[]) => {
      this.employees = ems;
    });

    this.rs.get('doctors').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });

  }

  createForm() {
    this.form.controls['doctordegrees'].setValidators([]);
    this.form.controls['description'].setValidators([]);
    this.form.controls['slmcregno'].setValidators([Validators.required, Validators.pattern(this.regexes['slmcregno']['regex'])]);
    this.form.controls['doslmcregisterd'].setValidators([Validators.required]);
    this.form.controls['foreigntraining'].setValidators([]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['doctorgrade'].setValidators([Validators.required]);
    this.form.controls['country'].setValidators([]);
    this.form.controls['doctorclinictype'].setValidators([]);
    this.form.controls['perpatientrate'].setValidators([]);

    this.innerform.controls['year'].setValidators([Validators.required]);
    this.innerform.controls['degree'].setValidators([Validators.required]);
    this.innerform.controls['university'].setValidators([Validators.required]);


    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "doslmcregistered")
            value = this.datep.transform(new Date(value), 'yyyy-MM-dd');

          if (this.olddoctor != undefined && control.valid) {
            // @ts-ignore
            if (value === this.purorder[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }
  }

  fillForm() {
      //@ts-ignore
      this.newdoctor.employee = this.employees.find(s => s.id === this.newdoctor.employee.id);

    //@ts-ignore
      this.newdoctor.country = this.countries.find(s => s.id === this.newdoctor.country.id);

      //@ts-ignore
      this.newdoctor.doctorgrade = this.doctorgrades.find(s => s.id === this.newdoctor.doctorgrade.id);
      //@ts-ignore
      // this.newdoctor.country = this.countries.find(s => s.id === this.newdoctor.country.id);
      //@ts-ignore
      // this.doctorclinictypes = this.newdoctor.doctorclinictype;
      this.doctorclinictypes = this.newdoctor.doctorclinictype;
      //
      this.indata = new MatTableDataSource(this.newdoctor.doctordegrees);

      this.form.patchValue(this.newdoctor);
      this.form.markAsPristine();


  }
  btnaddMc() {
    this.innerdata = this.innerform.getRawValue();
    if (this.innerdata != null) {
      let docdegree = new Doctordegree(
        this.innerdata.year,
        this.innerdata.degree,
        this.innerdata.university,
      );
      let tem: Doctordegree[] = [];
      if (this.indata != null) this.indata.data.forEach((i) => tem.push(i));

      this.doctordegrees = [];
      tem.forEach((t) => this.doctordegrees.push(t));

      this.doctordegrees.push(docdegree);
      this.indata = new MatTableDataSource(this.doctordegrees);

      this.innerform.reset();
    }

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
      this.newdoctor.doctorclinictype = this.doctorclinictypes;

      let doctor: string = "";

      doctor = doctor + "<br>Name  is : " + this.newdoctor.employee.fullname;
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
              this.innerform.reset();
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

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - " + this.title + " Update ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });

    } else {

      let updates: string = this.getUpdates();

     if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dialog.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - " + this.title + " Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.newdoctor = this.form.getRawValue();

            // @ts-ignore
            this.newdoctor.doslmcregisterd = this.datep.transform( this.newdoctor.doslmcregisterd, 'yyyy-MM-dd');

            this.newdoctor.doctordegrees = this.doctordegrees;
            this.newdoctor.doctorclinictype = this.doctorclinictypes;

            console.log(this.newdoctor.doctorclinictype)
            console.log(this.doctorclinictypes);
            this.doctorss.update(this.newdoctor).then((responce: [] | undefined) => {
              if (responce != undefined) { // @ts-ignore
                updstatus = responce['errors'] == "";
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                updstatus = false;
                updmessage = "Content Not Found"
              }
            }).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.form.reset();
                Object.values(this.form.controls).forEach(control => {
                  control.markAsTouched();
                });
              }

              const stsmsg = this.dialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status - " + this.title + " Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => {
                if (!result) {
                  return;
                }
              });

            });
          }
        });
      } else {

        const updmsg = this.dialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - " + this.title + " Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => {
          if (!result) {
            return;
          }
        });

      }
    }
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

  getUpdates(): string {

    let updates: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    let newarr = this.newdoctor.doctordegrees.length
    let oldarr = this.doctordegrees.length
    console.log(newarr , oldarr)
    if(newarr != oldarr){
      updates +=" <br> Drug table has been Changed "
    }
    return updates;
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
  deleteRaw(x: any) {

    let datasources = this.indata.data

    const index = datasources.findIndex(m => m.id === x.id);
    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.doctordegrees = this.indata.data;

  }


  rightSelected(): void {
    this.newdoctor.doctorclinictype = this.availablelist.selectedOptions.selected.map(option => {
      const doctorclinictype = new Doctorclinictype(option.value);
      this.clinictypes = this.clinictypes.filter(ad => ad !== option.value); //Remove Selected
      this.doctorclinictypes.push(doctorclinictype); // Add selected to Right Side
      return doctorclinictype;
    });

    this.form.controls["doctorclinictype"].clearValidators();
    this.form.controls["doctorclinictype"].updateValueAndValidity(); // Update status
  }

  rightAll(): void {
    this.newdoctor.doctorclinictype = this.availablelist.selectAll().map(option => {
      const doctorclinictype = new Doctorclinictype( option.value);
      this.clinictypes = this.clinictypes.filter(ad => ad !== option.value);
      this.doctorclinictypes.push(doctorclinictype)
      return doctorclinictype;
    });

    this.form.controls["doctorclinictype"].clearValidators();
    this.form.controls["doctorclinictype"].updateValueAndValidity();
  }

  leftSelected(): void {
    const selectedOptions = this.selectedlist.selectedOptions.selected; // Right Side
    for (const option of selectedOptions) {
      const extClinictype = option.value;
      this.doctorclinictypes = this.doctorclinictypes.filter(ad => {
        ad !== extClinictype
      }); // Remove the Selected one From Right Side
      this.clinictypes.push(extClinictype);
    }

  }

  leftAll(): void {
    for (let doclinic of this.doctorclinictypes) this.clinictypes.push(doclinic.clinictype);
    this.doctorclinictypes = [];
  }
}
