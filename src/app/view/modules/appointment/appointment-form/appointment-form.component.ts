import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Patient} from "../../../../entity/patient";
import {Employee} from "../../../../entity/employee";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Gender} from "../../../../entity/gender";
import {EmployeeService} from "../../../../service/employeeservice";
import {DatePipe, Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {Patientservice} from "../../../../service/patientservice";
import {RegexService} from "../../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {Appointment} from "../../../../entity/appointment";
import {Appointmenttype} from "../../../../entity/appointmenttype";
import {Appointmentstatus} from "../../../../entity/appointmentstatus";
import {Clinictype} from "../../../../entity/clinictype";
import {AppointmentService} from "../../../../service/appointment.service";
import {AppointmenttypeService} from "../../../../service/appointmenttype.service";
import {AppointmentstatusService} from "../../../../service/appointmentstatus.service";
import {ClinictypeService} from "../../../../service/clinictype.service";
import {Clinic} from "../../../../entity/clinic";
import {ClinicService} from "../../../../service/clinic.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent {

  public form!: FormGroup;

  updateForm:boolean = false;
  id!: number ;
  sclinicisempty!:boolean;

  newappointment!: Appointment;
  oldappointment!: Appointment;

  // selectedrow: any;

  employees: Array<Employee> = [];
  data!: MatTableDataSource<Patient>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'

  // enaadd:boolean = false;
  // enaupd:boolean = false;
  // enadel:boolean = false;

  appointments: Array<Appointment> = [];
  appointmenttypes: Array<Appointmenttype> = [];
  appointmentstatuses: Array<Appointmentstatus> = [];
  clinictypes: Array<Clinictype> = [];
  genders: Array<Gender> = [];
  patients: Array<Patient> = [];
  scheduledclinics: Array<Clinic> = [];
  number!: number;

  schedulesub!: Subscription;

  regexes: any;

  constructor(

    private appointmentservice: AppointmentService,
    private appointmenttypeservice: AppointmenttypeService,
    private appointmentstatusservice: AppointmentstatusService,
    private empservice: EmployeeService,
    private clinictypeservice: ClinictypeService,
    private clinicservice: ClinicService,
    private patientservice: Patientservice,


    private _location: Location,
    private arouter:ActivatedRoute,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService:AuthorizationManager) {


    this.form = this.fb.group({
      "clinictype": new FormControl('', [Validators.required]),
      "clinic": new FormControl('', [Validators.required]),
      "patient": new FormControl('', [Validators.required]),
      "appointmentstatus": new FormControl(),
      "appointmenttype": new FormControl('', [Validators.required]),
      "date": new FormControl(),
      "employee": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required])
    }, {updateOn: 'change'});


  }

  ngOnInit() {
    this.id = this.arouter.snapshot.params['id'];
    if(this.arouter.snapshot.params['id']){
      // @ts-ignore
      this.appointmentservice.get(this.id).then((appointment: Appointment) => {
        this.oldappointment = appointment;
        this.newappointment = appointment;
        this.updateForm  = true;
        console.log(this.newappointment);
        this.fillForm();
      });

    }

    this.initialize();
  }

  initialize() {

    this.empservice.getAll('').then((emp: Employee[]) => {
      this.employees = emp;
    });
    this.patientservice.getAll('').then((patient: Patient[]) => {
      this.patients = patient;
    });
    this.clinictypeservice.getAllList().then((clinictypes:Clinictype[])=>{
      this.clinictypes = clinictypes;
    });
    this.appointmenttypeservice.getAll().then((appointmenttypes:Appointmenttype[])=>{
      this.appointmenttypes = appointmenttypes;
    })
    this.appointmentstatusservice.getAll().then((appointmentstatuses:Appointmentstatus[])=>{
      this.appointmentstatuses = appointmentstatuses;
    })

    // this.doctorss.getAllList('')then((docs: Doctor[]) => {
    //   this.regexes = regs;
    //   this.createForm();
    // });
    this.getscheduledclinic();
    this.getcountbyclinic();
  }

getscheduledclinic(){
    // @ts-ignore
  // this.schedulesub = this.form.get('clinictype')?.valueChanges.subscribe((value:Clinictype) =>{
  this.form.get('clinictype')?.valueChanges.subscribe((value:Clinictype) =>{
     let query = "";
     if(value == null )return;
     query = "?clinicstatusid=1&clinictypeid="+value.id;
     this.clinicservice.getAllScheduled(query).then((clinics: Clinic[])=>{
       if(clinics.length == 0){
         this.sclinicisempty = true;
       }else{
         this.sclinicisempty = false;
       }
       console.log(this.sclinicisempty);
       this.scheduledclinics = clinics;
     });
  })
}


  getcountbyclinic(){
    this.form.get('clinic')?.valueChanges.subscribe((value:Clinic) =>{
      if(value == null )return;
      this.appointmentservice.getcount(value.id).then((count: number)=>{
        this.number = parseInt( value.id + '0' + (count+1));
        console.log(this.number)
      });
    });
  }
  createForm() {

    this.form.controls['clinic'].setValidators([Validators.required]);
    this.form.controls['number'].setValidators([Validators.required]);
    this.form.controls['patient'].setValidators([Validators.required]);
    this.form.controls['appointmentstatus'].setValidators([Validators.required]);
    this.form.controls['appointmenttype'].setValidators([Validators.required]);
    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "dobirth" || controlName == "doassignment")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldappointment != undefined && control.valid) {
            // @ts-ignore
            if (value === this.employee[controlName]) {
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

    // this.enableButtons(true,false,false);

  }


  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Appointment Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {
      this.newappointment = this.form.getRawValue()
      this.newappointment.appointmentstatus = this.appointmentstatuses[0];

      this.newappointment.number = this.number

      let formdata: string = "";

      formdata = formdata + "<br>  Appointment number is  : " + this.newappointment.number;
      formdata = formdata + "<br> Clinic Type is : " + this.newappointment.clinic.clinictype.name;
      formdata = formdata + "<br> Description is : " + this.newappointment.description;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Appointment Add",
          message: "Are you sure to Add the following Appointment Data ? <br> <br>" + formdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.appointmentservice.add(this.newappointment).then((responce: [] | undefined) => {
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
              data: {heading: "Status - Appointment Add", message: addmessage}
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

  fillForm() {

    // this.schedulesub.unsubscribe();
    this.form.controls['clinictype'].setValue( this.clinictypes.find( c => c.id == this.newappointment.clinic.clinictype.id));
    this.form.controls['clinic'].setValue(this.scheduledclinics.find( sc => sc.id == this.newappointment.clinic.id));

    //@ts-ignore
    this.newappointment.appointmentstatus  = this.appointmentstatuses.find(a => a.id === this.newappointment.appointmentstatus.id);

    //@ts-ignore
    this.newappointment.appointmenttype  = this.appointmenttypes.find(a => a.id === this.newappointment.appointmenttype.id);
    //@ts-ignore
    this.newappointment.patient = this.patients.find(p => p.id === this.newappointment.patient.id);
    //@ts-ignore
    this.newappointment.employee = this.employees.find(e => e.id === this.newappointment.employee.id);
    //@ts-ignore
    // this.patient.relationship = this.relationship.find(s => s.id === this.patient.relationship.id);

    this.form.patchValue(this.newappointment);
    this.form.markAsPristine();

  }


  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
  }


  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Appointment Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Appointmant Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("EmployeeService.update()");
            this.newappointment = this.form.getRawValue();
            // if (this.form.controls['photo'].dirty) this.patient.photo = btoa(this.imageempurl);
            // this.patient.photo = this.oldpatinet.photo;
            this.newappointment.id = this.oldappointment.id;
            this.newappointment.number  = this.number;
            console.log(this.newappointment)
            this.appointmentservice.update(this.newappointment).then((responce: [] | undefined) => {
              if (responce != undefined) { // @ts-ignore
                //console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
                // @ts-ignore
                updstatus = responce['errors'] == "";
                //console.log("Upd Sta-" + updstatus);
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                //console.log("undefined");
                updstatus = false;
                updmessage = "Content Not Found"
              }
            } ).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.form.reset();
                // this.clearImage();
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                // this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status Appointment Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Appointment Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }


  }



  clear():void{
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Appointmnet Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset()
      }
    });
  }


  backtoview() {
    this._location.back();
  }


}
