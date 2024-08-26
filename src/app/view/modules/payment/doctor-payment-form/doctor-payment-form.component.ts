import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Doctorpayment} from "../../../../entity/doctorpayment";
import {Doctorpaymentstatus} from "../../../../entity/doctorpaymentstatus";
import {DoctorpaymentService} from "../../../../service/doctorpaymentservice";
import {ActivatedRoute} from "@angular/router";
import {DatePipe, Location} from "@angular/common";
import {RegexService} from "../../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {Doctorpaymentstatusservice} from "../../../../service/doctorpaymentstatusservice";
import {Clinic} from "../../../../entity/clinic";
import {ClinicService} from "../../../../service/clinic.service";
import {EmployeeService} from "../../../../service/employeeservice";
import {Employee} from "../../../../entity/employee";

@Component({
  selector: 'app-doctor-payment-form',
  templateUrl: './doctor-payment-form.component.html',
  styleUrls: ['./doctor-payment-form.component.css']
})
export class DoctorPaymentFormComponent {


  title: string = 'Doctor Payment';

  public form!: FormGroup;

  changedstatus:boolean = false

  newdoctorpayment!: Doctorpayment;
  olddoctorpayment!: Doctorpayment;

  regexes: any;
  updateForm: boolean = false;
  id!: number;



  clinics: Array<Clinic> = [];
  employees: Array<Employee> = [];
  doctorpaymentstatuses: Array<Doctorpaymentstatus> = [];


  constructor(
    private clinicService: ClinicService,
    private employeeService: EmployeeService,
    private doctorpaymentService: DoctorpaymentService,
    private doctorpaymentstatusservice: Doctorpaymentstatusservice,


    private arouter: ActivatedRoute,
    private _location: Location,
    private rs: RegexService,
    private formb: FormBuilder,
    private dialog: MatDialog,
    private datep: DatePipe,
    public authService: AuthorizationManager
  ) {


    this.form = this.formb.group({
      "clinic": new FormControl('', [Validators.required]),
      "doctorpaymentstatus": new FormControl('', [Validators.required]),
      // "paiddate": new FormControl('', [Validators.required]),
      "description": new FormControl(),
      "employee": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});


  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.id = this.arouter.snapshot.params['id'];
    if (this.arouter.snapshot.params['id']) {

      this.doctorpaymentService.get(this.id).then((pres: Doctorpayment | undefined) => {
        if (pres != undefined) {
          this.olddoctorpayment = pres;
          this.newdoctorpayment = pres;
        }
        this.updateForm = true;
        this.fillForm();
      });

    }

    this.initialize();
  }

  initialize() {

    this.clinicService.getAll('').then((objs: Clinic[]) => {
      console.log(objs);
      this.clinics = objs;
    });

    this.doctorpaymentstatusservice.getAll().then((objs: Doctorpaymentstatus[]) => {
      this.doctorpaymentstatuses = objs;
    });
    this.employeeService.getAll('').then((objs: Employee[]) => {
      this.employees = objs;
    });

    this.rs.get('doctorpayments').then((regs: any) => {
      this.regexes = regs;
      this.createForm();
    });

    this.getstatuschage();
  }

  getstatuschage() {
    // @ts-ignore
    this.form.get('doctorpaymentstatus')?.valueChanges.subscribe((value: Doctorpaymentstatus) => {

      if(value.name == 'Paid'){
        this.changedstatus =true;
      }

    });
  }

  createForm() {

    this.form.controls['clinic'].setValidators([Validators.required]);
    this.form.controls['doctorpaymentstatus'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([]);
    this.form.controls['employee'].setValidators([Validators.required]);


    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.newdoctorpayment != undefined && control.valid) {
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

    // this.enableButtons(true, false, false);
  }


  fillForm() {
    setTimeout(() => {
      //@ts-ignore
      this.newdoctorpayment.clinic = this.clinics.find(s => s.id === this.newdoctorpayment.clinic.id);
      //@ts-ignore
      this.newdoctorpayment.employee = this.employees.find(s => s.id === this.newdoctorpayment.employee.id);
      //@ts-ignore
      this.newdoctorpayment.doctorpaymetstatus = this.doctorpaymentstatuses.find(e => e.id === this.newdoctorpayment.doctorpaymetstatus.id);
    }, 500);

      this.form.patchValue(this.newdoctorpayment);
      this.form.markAsPristine();


  }



  add() {
    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - " + this.title + " Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.newdoctorpayment = this.form.getRawValue();

      // let paymentstatus = this.newdoctorpayment.doctorpaymetstatus.name
      if( this.changedstatus){
        this.newdoctorpayment.paiddate = this.datep.transform( new Date(), 'yyyy-MM-dd');
      }
      console.log(this.newdoctorpayment)
      let stirngobj: string = "";

      stirngobj = stirngobj + "<br> Doctor Payment status : " + this.newdoctorpayment.clinic.clinictype.name;
      const confirm = this.dialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - " + this.title + " Add",
          message: "Are you sure to Add the following Doctorpayment data? <br> <br>" + stirngobj
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.doctorpaymentService.add(this.newdoctorpayment).then((responce: [] | undefined) => {

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
              data: {heading: "Status - " + this.title + " Add", message: addmessage}
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
            this.newdoctorpayment = this.form.getRawValue();

            this.newdoctorpayment.id = this.olddoctorpayment.id;

            if(this.changedstatus){
              this.newdoctorpayment.paiddate = this.datep.transform( new Date(), 'yyyy-MM-dd');
            }


            this.doctorpaymentService.update(this.newdoctorpayment).then((responce: [] | undefined) => {
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

  getUpdates(): string {

    let updates: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    return updates;
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

  clear(): void {
    const confirm = this.dialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - " + this.title + " Clear",
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

}
