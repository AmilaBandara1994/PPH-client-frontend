import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Prescription} from "../../../../entity/prescription";
import {MatTableDataSource} from "@angular/material/table";
import {UiAssist} from "../../../../util/ui/ui.assist";
import {DatePipe, Location} from "@angular/common";
import {RegexService} from "../../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {Prescriptiondrug} from "../../../../entity/prescriptiondrug";
import {Drugschedule} from "../../../../entity/drugschedule";
import {Meal} from "../../../../entity/meal";
import {Dosage} from "../../../../entity/dosage";
import {Prescriptionstatus} from "../../../../entity/prescriptionstatus";
import {Mealservice} from "../../../../service/mealservice";
import {Drugscheduleservice} from "../../../../service/drugscheduleservice";
import {Dosageservice} from "../../../../service/dosageservice";
import {PrescriptionService} from "../../../../service/prescriptionservice";
import {Prescriptionstatusservice} from "../../../../service/prescriptionstatusservice";
import {Drugservice} from "../../../../service/drugservice";
import {AppointmentService} from "../../../../service/appointment.service";
import {Drug} from "../../../../entity/drug";
import {Appointment} from "../../../../entity/appointment";
import {Diagnosis} from "../../../../entity/diagnosis";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-prescription-form',
  templateUrl: './prescription-form.component.html',
  styleUrls: ['./prescription-form.component.css']
})
export class PrescriptionFormComponent {

  incolumns: string[] = ['drug', 'drugschedule', 'dosage', 'meal', 'remove'];
  inheaders: string[] = ['Drug Name', 'Schedule', 'Dosage', 'Use', 'Remove',];
  inbinders: string[] = ['drug.name', 'drugschedule.name', 'dosage.name', 'meal.name', 'getBtn()'];

  title: string = 'Prescription';

  public form!: FormGroup;
  public innerform!: FormGroup;

  newpresciption!: Prescription;
  oldpresciption!: Prescription;

  regexes: any;
  updateForm: boolean = false;
  id!: number;

  innerdata: any;

  prescriptiondrugs: Array<Prescriptiondrug> = [];
  indata!: MatTableDataSource<Prescriptiondrug>
  uiassist: UiAssist;

  meals: Array<Meal> = [];
  drugschedules: Array<Drugschedule> = [];
  dosages: Array<Dosage> = [];
  prescriptionstatuses: Array<Prescriptionstatus> = [];
  drugs: Array<Drug> = [];
  appointments: Array<Appointment> = [];


  constructor(
    private mealservice: Mealservice,
    private drugscheduleservice: Drugscheduleservice,
    private dosageservice: Dosageservice,
    private drugservice: Drugservice,
    private appointmentService: AppointmentService,
    private prescriptionService: PrescriptionService,
    private prescriptionstatusservice: Prescriptionstatusservice,
    private arouter: ActivatedRoute,
    private _location: Location,
    private rs: RegexService,
    private formb: FormBuilder,
    private dialog: MatDialog,
    private datep: DatePipe,
    public authService: AuthorizationManager
  ) {


    this.innerform = this.formb.group({
      "drug": new FormControl('', [Validators.required]),
      "drugschedule": new FormControl('', [Validators.required]),
      "meal": new FormControl('', [Validators.required]),
      "dosage": new FormControl('', [Validators.required]),
      "days": new FormControl(),
      "dose": new FormControl(),
      "description": new FormControl(),
    }, {updateOn: 'change'});


    this.form = this.formb.group({
      "appointment": new FormControl('', [Validators.required]),
      "prescriptionstatus": new FormControl('', [Validators.required])
    }, {updateOn: 'change'});

    this.uiassist = new UiAssist(this);

  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.id = this.arouter.snapshot.params['id'];
    if (this.arouter.snapshot.params['id']) {

      this.prescriptionService.get(this.id).then((pres: Prescription | undefined) => {
        if (pres != undefined) {
          this.oldpresciption = pres;
          this.newpresciption = pres;
        }
        this.updateForm = true;
        console.log('diakdjfdf ', pres);
        this.fillForm();
      });

    }

    this.initialize();
  }

  initialize() {

    this.mealservice.getAll().then((meals: Meal[]) => {
      this.meals = meals;
    });
    this.drugscheduleservice.getAll().then((drugsdul: Drugschedule[]) => {
      this.drugschedules = drugsdul;
    });
    this.dosageservice.getAll().then((dosage: Dosage[]) => {
      this.dosages = dosage;
    });
    this.prescriptionstatusservice.getAll().then((press: Prescriptionstatus[]) => {
      this.prescriptionstatuses = press;
    });
    this.drugservice.getAll('').then((drg: Drug[]) => {
      this.drugs = drg;
    });
    this.appointmentService.getAll('').then((appos: Appointment[]) => {
      this.appointments = appos;
    });

    this.regexes.getAllList('prescriptions').then((regs: any) => {
      this.regexes = regs;
      this.createForm();
    });

  }

  createView() {
    // this.imageurl = 'assets/pending.gif';
    // this.loadTable("");
  }

  createForm() {

    this.innerform.controls['year'].setValidators([Validators.required]);
    this.innerform.controls['degree'].setValidators([Validators.required]);
    this.innerform.controls['university'].setValidators([Validators.required]);


    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {

        if (this.newpresciption != undefined && control.valid) {
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
      this.newpresciption.appointment = this.appointments.find(s => s.id === this.newpresciption.appointment.id);
      //@ts-ignore
      this.newpresciption.prescriptionstatus = this.prescriptionstatuses.find(e => e.id === this.newpresciption.prescriptionstatus.id);

      this.indata = new MatTableDataSource(this.newpresciption.prescriptiondrugs);
      this.form.patchValue(this.newpresciption);
      this.form.markAsPristine();
    }, 500);


  }

  btnaddMc() {
    this.innerdata = this.innerform.getRawValue();
    if (this.innerdata != null) {
      let prescripdrug = new Prescriptiondrug(
        this.innerdata.drug,
        this.innerdata.drugschedule,
        this.innerdata.dosage,
        this.innerdata.meal,
        this.innerdata.dose,
        this.innerdata.description,
        this.innerdata.days
      );
      let tem: Prescriptiondrug[] = [];
      if (this.indata != null) this.indata.data.forEach((i) => tem.push(i));
      this.prescriptiondrugs = [];
      tem.forEach((t) => this.prescriptiondrugs.push(t));
      this.prescriptiondrugs.push(prescripdrug);
      console.log(this.prescriptiondrugs)
      this.indata = new MatTableDataSource(this.prescriptiondrugs);
      this.innerform.reset();
    }

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

      this.newpresciption = this.form.getRawValue();
      this.newpresciption.prescriptiondrugs = this.prescriptiondrugs
      console.log(this.newpresciption)
      let stirngobj: string = "";

      stirngobj = stirngobj + "<br> Presctiption  status : " + this.newpresciption.prescriptionstatus.name;
      const confirm = this.dialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - " + this.title + " Add",
          message: "Are you sure to Add the following Prescription data? <br> <br>" + stirngobj
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.prescriptionService.add(this.newpresciption).then((responce: [] | undefined) => {

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
      this.newpresciption.prescriptiondrugs = this.prescriptiondrugs


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
            this.newpresciption = this.form.getRawValue();
            this.newpresciption.prescriptiondrugs = this.prescriptiondrugs

            this.newpresciption.id = this.oldpresciption.id;


            this.prescriptionService.update(this.newpresciption).then((responce: [] | undefined) => {
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
    let newarr = this.newpresciption.prescriptiondrugs.length
    let oldarr = this.prescriptiondrugs.length
    console.log(newarr , oldarr)
    if(newarr != oldarr){
      updates +=" <br> Drug table has been Changed "
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

  deleteRaw(x: any) {

    let datasources = this.indata.data

    const index = datasources.findIndex(m => m.id === x.id);
    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.prescriptiondrugs = this.indata.data;


  }
}
