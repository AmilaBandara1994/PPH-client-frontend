import {Component, Input, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Investigation} from "../../../../entity/investigation";
import {Employee} from "../../../../entity/employee";
import {Appointment} from "../../../../entity/appointment";
import {Investigationstatus} from "../../../../entity/investigationstatus";
import {Investigationstatusservice} from "../../../../service/investigationstatusservice";
import {AppointmentService} from "../../../../service/appointment.service";
import {EmployeeService} from "../../../../service/employeeservice";
import {DatePipe, Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {RegexService} from "../../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {Reporttype} from "../../../../entity/reporttype";
import {Investigationresult} from "../../../../entity/investigationresult";
import {Reporttypeservice} from "../../../../service/reporttypeservice";
import {Investigationresultservice} from "../../../../service/investigationresultservice";
import {InvestigationService} from "../../../../service/investigationservice";

@Component({
  selector: 'app-investigation-form',
  templateUrl: './investigation-form.component.html',
  styleUrls: ['./investigation-form.component.css']
})
export class InvestigationFormComponent {

  imagedrugpurl: string = 'assets/my-img/banner/drugs.jpg'

  title: string = "Investigation"
  public form!: FormGroup;
  updateForm: boolean = false;
  id!: number;

  newInvestigation!: Investigation;
  oldInvestigation!: Investigation;

  // selectedrow: any;

  employees: Array<Employee> = [];
  appointments: Array<Appointment> = [];

  investigationstatuses: Array<Investigationstatus> = [];
  reporttypes: Array<Reporttype> = [];
  investigationresults: Array<Investigationresult> = [];

  regexes: any;


  constructor(
    private investigationstatusservice: Investigationstatusservice,
    private reporttypeservice: Reporttypeservice,
    private investigationresultservice: Investigationresultservice,
    private appointmentService: AppointmentService,
    private investigationService: InvestigationService,

    private empS: EmployeeService,
    private _location: Location,
    private arouter: ActivatedRoute,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService: AuthorizationManager) {


    this.form = this.fb.group({
      "appointment": new FormControl('', [Validators.required]),
      "reporttype": new FormControl('', [Validators.required]),
      "investigationstatus": new FormControl('', [Validators.required]),
      "investigationresult": new FormControl(),
      "conclution": new FormControl(),

      "reporteddate": new FormControl(),
      "report": new FormControl(),
      "description": new FormControl(),
      "employee": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});


  }

  ngOnInit() {

    this.id = this.arouter.snapshot.params['id'];
    if (this.arouter.snapshot.params['id']) {

      this.investigationService.get(this.id).then((investigation: Investigation | undefined) => {
        if (investigation != undefined) {
          this.oldInvestigation = investigation;
          this.newInvestigation = investigation;
        }
        this.updateForm = true;
        console.log('diakdjfdf ', investigation);
        this.fillForm();
      });

    }


    this.initialize();
  }

  initialize() {

    this.empS.getAll('').then((emp: Employee[]) => {
      this.employees = emp;
    })
    this.appointmentService.getAll('').then((appointments: Appointment[]) => {
      this.appointments = appointments;
    });
    this.investigationstatusservice.getAll().then((investigationstatuses: Investigationstatus[]) => {
      this.investigationstatuses = investigationstatuses;
    });
    this.reporttypeservice.getAll().then((reporttypes: Reporttype[]) => {
      this.reporttypes = reporttypes;
    });
    this.investigationresultservice.getAll().then((investigationresults: Investigationresult[]) => {
      this.investigationresults = investigationresults;
    })



    this.rs.get("diagnoses").then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });

  }

  createForm() {
    this.form.controls['appointment'].setValidators([Validators.required]);
    this.form.controls['reporttype'].setValidators([Validators.required]);
    this.form.controls['investigationstatus'].setValidators([Validators.required]);
    this.form.controls['investigationresult'].setValidators([]);
    this.form.controls['conclution'].setValidators([]);


    this.form.controls['reporteddate'].setValidators([]);
    this.form.controls['report'].setValidators([]);;
    this.form.controls['description'].setValidators([]);
    this.form.controls['employee'].setValidators([]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.newInvestigation != undefined && control.valid) {
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

  }

  generateName(reporttype: string,appointmentnumber: string) {
    return reporttype + "-(" + appointmentnumber + ")-" + this.dp.transform( new Date(), 'yyyy-MM-dd');
  }



  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - " + this.title + " Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {
      this.newInvestigation = this.form.getRawValue();
      this.newInvestigation.name = this.generateName(this.newInvestigation.reporttype.name, this.newInvestigation.name);

      let formdata: string = "";

      formdata = formdata + "<br>  Report Type : " + this.newInvestigation.reporttype.name;
      formdata = formdata + "<br> Investigation status : " + this.newInvestigation.investigationstatus;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - " + this.title + " Add",
          message: "Are you sure to Add the following " + this.title + " Data ? <br> <br>" + formdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";
      console.log('thsi is from add before service call ', this.newInvestigation);
      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.investigationService.add(this.newInvestigation).then((responce: [] | undefined) => {
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

    if (this.newInvestigation != undefined) {


      //@ts-ignore
      this.newInvestigation.appointment = this.appointments.find(a => a.id === this.newInvestigation.appointment.id);
      //@ts-ignore
      this.newInvestigation.severity = this.severities.find(p => p.id === this.newInvestigation.severity.id);
      //@ts-ignore
      this.newInvestigation.treatmentplan = this.treatmentplans.find(e => e.id === this.newInvestigation.treatmentplan.id);

      //@ts-ignore
      this.newInvestigation.investigationstatus = this.diseasediagnoses.find(a => a.id === this.newInvestigation.investigationstatus.id);
      //@ts-ignore
      this.newInvestigation.employee = this.employees.find(a => a.id === this.newInvestigation.employee.id);

      this.form.patchValue(this.newInvestigation);
      this.form.markAsPristine();
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


  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
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

        const confirm = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - " + this.title + " Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {


            //set name and code

            console.log(this.newInvestigation)
            this.investigationService.update(this.newInvestigation).then((responce: [] | undefined) => {
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
            }).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.form.reset();
                // this.clearImage();
                Object.values(this.form.controls).forEach(control => {
                  control.markAsTouched();
                });
                // this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status " + this.title + " Add", message: updmessage}
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

        const updmsg = this.dg.open(MessageComponent, {
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

  clear(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - " + this.title + " Clear",
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
