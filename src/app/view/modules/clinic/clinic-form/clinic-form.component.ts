import {Component} from '@angular/core';
import {ClinicService} from "../../../../service/clinic.service";
import {RegexService} from "../../../../service/regexservice";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe, Location} from "@angular/common";
import {ClinicstatusService} from "../../../../service/clinicstatus.service";
import {ClinictypeService} from "../../../../service/clinictype.service";
import {EmployeeService} from "../../../../service/employeeservice";
import {DoctorService} from "../../../../service/doctor.service";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {Clinic} from "../../../../entity/clinic";
import {Clinictype} from "../../../../entity/clinictype";
import {Doctor} from "../../../../entity/doctor";
import {Clinicstatus} from "../../../../entity/clinicstatus";
import {Employee} from "../../../../entity/employee";
import {Subscription} from "rxjs";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-clinic-form',
  templateUrl: './clinic-form.component.html',
  styleUrls: ['./clinic-form.component.css']
})
export class ClinicFormComponent {

  updatForm:boolean = false;
  id!: number ;

  enaadd:boolean = false;
  enaupd:boolean = false;

  public form!: FormGroup;

  newclinic!:Clinic;
  oldClinic!:Clinic;

  regexes: any;
  selectedrow: any;

  clinictypes: Array<Clinictype> = [];
  doctors: Array<Doctor> = [];
  doctorByClinictype: Array<Doctor> = [];
  clinicstatuses: Array<Clinicstatus> = [];
  nurses:Array<Employee> = [];
  employees:Array<Employee> = [];
  // filvaluesubscribe!:Subscription;
  // filformsub!:Subscription;

  constructor(    private cs: ClinicService,
                  private rs: RegexService,
                  private _location: Location,
                  private arouter:ActivatedRoute,
                  private fb: FormBuilder,
                  private dg: MatDialog,
                  private dp: DatePipe,
                  private css: ClinicstatusService,
                  private cts: ClinictypeService,
                  private es: EmployeeService,
                  private ds: DoctorService,
                  public authService:AuthorizationManager) {


    this.form = this.fb.group({
      "date": new FormControl("", Validators.required),
      "starttime": new FormControl("", Validators.required),
      "endtime": new FormControl("", Validators.required),
      "patientcount": new FormControl("", Validators.required),
      "totalincome": new FormControl("", Validators.required),
      "doctorpayment": new FormControl("", Validators.required),
      "clinictype": new FormControl("", Validators.required),
      "doctor": new FormControl("", Validators.required),
      "nurse1": new FormControl("", Validators.required),
      "nurse2": new FormControl(),
      "employee": new FormControl(),
      "clinicstatus": new FormControl("", Validators.required),
      "dopublish": new FormControl({value: new Date(), disabled:true}, Validators.required),
    },{updateOn: 'change'})
  }

  ngOnInit() {
    this.id = this.arouter.snapshot.params['id'];
    if(this.arouter.snapshot.params['id']){
    // @ts-ignore
      this.cs.get(this.id).then((clinic: Clinic) => {
        this.oldClinic = clinic;
        this.newclinic = clinic;
        this.updatForm  = true;
        console.log(this.newclinic);
        this.fillForm();
       });

    }
    this.initialize();
  }

  initialize() {


    this.ds.getAllList('').then((docts:Doctor[]) =>{
      this.doctors = docts;
    });

    this.css.getAllList().then((cstatuses: Clinicstatus[])=>{
      this.clinicstatuses = cstatuses;
    });

    this.cts.getAllList().then((ctypes: Clinictype[])=>{
      this.clinictypes = ctypes;
    });
    this.es.getAll('').then((emp: Employee[])=>{
      this.employees = emp;
    });

    this.rs.get('clinic').then((regs: []) => {
      this.regexes = regs;
    });
    this.filterDoctorByclinictype();
    this.getNurseFromEmployees();
  }

  filterDoctorByclinictype(){
    // @ts-ignore
    this.form.get('clinictype')?.valueChanges.subscribe((value: Clinictype) =>{
      console.log('this also executed ?');
      let query = "";
      query = "?clinictypeid="+ value.id;
      this.ds.getAllList(query).then((doct:Doctor[]) =>{
        this.doctorByClinictype  = doct;
      });
    });
  }

  getNurseFromEmployees(){

    let query = "?designationid="+ 3;

    this.es.getAll(query).then((nurse: Employee[])=>{
      this.nurses = nurse;
    });
  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Clinic Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.newclinic = this.form.getRawValue();
      // @ts-ignore
      this.newclinic.date = this.dp.transform( this.newclinic.date, 'yyyy-MM-dd');
      // @ts-ignore
      this.newclinic.dopublish = this.dp.transform( this.newclinic.dopublish, 'yyyy-MM-dd');

      let clinic: string = "";

      clinic = clinic + "<br>Type of Clinic is : " + this.newclinic.clinictype.name;
      // clinic = clinic + "<br>Doctor Name is : " + this.newclinic.doctor.employee.fullname;
      clinic = clinic + "<br>Stat time is : " + this.newclinic.starttime;
      clinic = clinic + "<br>End time is : " + this.newclinic.endtime;
      clinic = clinic + "<br>Clinic status is : " + this.newclinic.clinicstatus.name;
      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Clinic Add",
          message: "Are you sure to Add the following Clinic data? <br> <br>" + clinic
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.cs.add(this.newclinic).then((responce: [] | undefined) => {

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

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status - Clinic Add", message: addmessage}
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
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Clinic Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset();
      }
    });
  }

  fillForm(){

    // this.filvaluesubscribe.unsubscribe();

    // @ts-ignore
    this.filformsub = this.form.get('clinictype')?.valueChanges.subscribe((clinictype:Clinictype)=>{
      let query = "?clinictypeid="+ clinictype.id;
      this.ds.getAllList(query).then((docto:Doctor[]) =>{
        this.doctorByClinictype  = docto;
        // @ts-ignore
        this.newclinic.doctor = this.doctorByClinictype.find(d=> d.id === this.newclinic.doctor.id );
        // @ts-ignore
        this.newclinic.nurse1 = this.nurses.find(n=> this.newclinic.nurse1.id === n.id );
        // @ts-ignore
        this.newclinic.clinicstatus = this.clinicstatuses.find(cs=> cs.id === this.newclinic.clinicstatus.id );
        // @ts-ignore
        this.newclinic.employee = this.employees.find(cs=> cs.id === this.newclinic.employee.id );

        console.log(this.newclinic)
        this.form.patchValue(this.newclinic);
        this.form.markAsPristine();

        // this.enableButtons(false,true,true);
      })
    });

    // @ts-ignore
    this.newclinic.clinictype = this.clinictypes.find(cs=> cs.id === this.newclinic.clinictype.id );
    this.form.controls['clinictype'].setValue(this.newclinic.clinictype);
    // this.filformsub.unsubscribe();
  }

  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Clinic Update ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Clinic Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.newclinic = this.form.getRawValue();
            this.newclinic.id = this.oldClinic.id;

            this.cs.update(this.newclinic).then((responce: [] | undefined) => {
              if (responce != undefined) {
                // @ts-ignore
                updstatus = responce['errors'] == "";
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                updstatus = false;
                updmessage = "Content Not Found"
              }
            } ).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.form.reset();
                this.updatForm = false
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status - Clinic Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Clinic Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }

  }

  getUpdates() {
    let updates = '';
    for (const controlName in this.form.controls){
      const control = this.form.controls[controlName];

      if(control.dirty){
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
  }

  backtoview() {
    this._location.back();
  }
}
