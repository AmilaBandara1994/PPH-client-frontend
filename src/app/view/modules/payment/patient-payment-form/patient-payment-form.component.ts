import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Employee} from "../../../../entity/employee";
import {EmployeeService} from "../../../../service/employeeservice";
import {DatePipe, Location} from "@angular/common";
import {ClinictypeService} from "../../../../service/clinictype.service";
import {RegexService} from "../../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {Clinictype} from "../../../../entity/clinictype";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {PaymentstatusService} from "../../../../service/paymentstatus.service";
import {PaytypeService} from "../../../../service/paytype.service";
import {Bankservice} from "../../../../service/bankservice";
import {Patientpaymentservice} from "../../../../service/patientpaymentservice";
import {Patientpayment} from "../../../../entity/patientpayment";
import {Paymentstatus} from "../../../../entity/paymentstatus";
import {Paytype} from "../../../../entity/paytype";
import {Bank} from "../../../../entity/bank";
import {Appointment} from "../../../../entity/appointment";
import {ActivatedRoute} from "@angular/router";
import {Patient} from "../../../../entity/patient";
import {Patientservice} from "../../../../service/patientservice";
import {AppointmentService} from "../../../../service/appointment.service";
import {Cardpayment} from "../../../../entity/cardpayment";
import {MatTableDataSource} from '@angular/material/table';
import {UiAssist} from 'src/app/util/ui/ui.assist';
import {Prescription} from "../../../../entity/prescription";
import {PrescriptionService} from "../../../../service/prescriptionservice";
import {Drugservice} from "../../../../service/drugservice";

@Component({
  selector: 'app-patient-payment-form',
  templateUrl: './patient-payment-form.component.html',
  styleUrls: ['./patient-payment-form.component.css']
})
export class PatientPaymentFormComponent {


  incolumns: string[] = ['bank', 'number', 'branch', 'remove'];
  inheaders: string[] = ['Bank', 'Card Number', 'Bank Branch', 'Remove',];
  inbinders: string[] = ['bank.name', 'number', 'bankbranch', 'getBtn()'];

  innerdata: any;
  oldinnerdata: any;
  title: string = 'Patient Payment';

  public form!: FormGroup;
  innerform!: FormGroup;

  updateForm: boolean = false;
  // amountdisable:boolean = true;
  cardpayment: boolean = false;
  id!: number;

  newpatientpayment!: Patientpayment;
  odlpatientpayment!: Patientpayment;


  regexes: any;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  selectedrow: any;

  patientpayments: Array<Patientpayment> = [];
  paymentstatuses: Array<Paymentstatus> = [];
  paytypes: Array<Paytype> = [];
  banks: Array<Bank> = [];
  employees: Array<Employee> = [];
  patients: Array<Patient> = [];
  clinictypes: Array<Clinictype> = [];
  appointments: Array<Appointment> = [];
  cardpayments: Array<Cardpayment> = [];

  prescriptions: Array<Prescription> = [];
  filterprescriptions: Array<Prescription> = [];

  // prescription!: Prescription;

  indata!: MatTableDataSource<Cardpayment>

  uiassist: UiAssist;

  constructor(
    private paymentstatusservice: PaymentstatusService,
    private paytypeservice: PaytypeService,
    private bankservice: Bankservice,
    private clinictpeservice: ClinictypeService,
    private empservice: EmployeeService,
    private patientservice: Patientservice,
    private appointmentService: AppointmentService,
    private patientpaymentservice: Patientpaymentservice,
    private prescriptionService: PrescriptionService,
    private drugservice: Drugservice,
    private _location: Location,
    private arouter: ActivatedRoute,
    private rs: RegexService,
    private formb: FormBuilder,
    private dialog: MatDialog,
    private datep: DatePipe,
    public authService: AuthorizationManager
  ) {

    this.uiassist = new UiAssist(this);
    this.form = this.formb.group({
      // "patient": new FormControl('', [Validators.required]),
      "appointment": new FormControl('', [Validators.required]),
      "paytype": new FormControl('', [Validators.required]),
      "amount": new FormControl().disabled,
      "paymentstatus": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      // "date": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

    this.innerform = this.formb.group({
      "bank": new FormControl('', [Validators.required]),
      "number": new FormControl('', [Validators.required]),
      "bankbranch": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

  }


  ngOnInit() {
    window.scrollTo(0, 0);
    this.id = this.arouter.snapshot.params['id'];
    if (this.arouter.snapshot.params['id']) {
      // @ts-ignore
      this.patientpaymentservice.get(this.id).then((patientpayment: Patientpayment) => {
        this.odlpatientpayment = patientpayment;
        this.newpatientpayment = patientpayment;
        this.updateForm = true;
        console.log('this is the when load', this.newpatientpayment);
        this.fillForm();
      });

    }
    this.initialize();

  }

  initialize() {

    // this.createView();

    this.paymentstatusservice.getAll().then((paystatus: Paymentstatus[]) => {
      this.paymentstatuses = paystatus;
    });
    this.paytypeservice.getAll().then((paytypes: Paytype[]) => {
      this.paytypes = paytypes;
    });
    this.bankservice.getAll().then((banks: Bank[]) => {
      this.banks = banks;
    })
    this.patientservice.getAll('').then((patients: Patient[]) => {
      this.patients = patients;
    })
    this.empservice.getAll('').then((employees: Employee[]) => {
      this.employees = employees;
    })
    this.appointmentService.getAll('?appointmentstatusid=2').then((appointments: Appointment[]) => {
      this.appointments = appointments;
    })
    this.clinictpeservice.getAllList().then((clinictypes: Clinictype[]) => {
      this.clinictypes = clinictypes;
    })
    this.prescriptionService.getAll('').then((prescriptions: Prescription[]) => {
      this.prescriptions = prescriptions;
    })


    // this.doctorss.getAllList('')then((docs: Doctor[]) => {
    //   this.regexes = regs;
    //   this.createForm();
    // });
    this.counttotal();
    this.setcardpayment();

  }

  counttotal() {
    this.form.get('appointment')?.valueChanges.subscribe((value: Appointment) => {
      this.form.controls['amount'].setValue(0);
      this.filterprescriptions = [];
      let total = 0;

      setTimeout(() => {

        this.filterprescriptions = this.prescriptions.filter(precrip => {
          // @ts-ignore
          return precrip.appointment.id == value.id;
        })
        console.log('filtered', this.filterprescriptions);
        this.filterprescriptions.map(drug => {
         drug.prescriptiondrugs.map(drg =>{

          // console.log('days ', drug.appointment.)
          // console.log('dossage ', drug.dosage.value)
          // console.log('scheule ', drug.drugschedule.value)
          // console.log('sprice ', drug.drug.sprice)
          // @ts-ignore
          total += (drg.days * (drg.dosage.value * drg.drugschedule.value)) * drg.drug.sprice;
         })
        })
        this.form.controls['amount'].setValue(total);
      }, 500)

      total += value.clinic.doctorpayment;
      console.log(value)
    })
  }

  setcardpayment() {
    // @ts-ignore
    // this.schedulesub = this.form.get('clinictype')?.valueChanges.subscribe((value:Clinictype) =>{
    this.form.get('paytype')?.valueChanges.subscribe((value: Paytype) => {
      if (value.id == 2) {
        this.cardpayment = true;
      } else {
        this.cardpayment = false;
      }
    })
  }

  createForm() {

    this.form.controls['petient'].setValidators([Validators.required]);
    this.form.controls['appointment'].setValidators([Validators.required]);
    this.form.controls['paytype'].setValidators([Validators.required]);
    this.form.controls['amount'].setValidators([]);
    this.form.controls['paymentstatus'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "dobirth" || controlName == "doassignment")
            value = this.datep.transform(new Date(value), 'yyyy-MM-dd');

          if (this.odlpatientpayment != undefined && control.valid) {
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


  filterDates = (date: Date | null): boolean => {
    const currentDate = new Date();
    return !date || date.getTime() <= currentDate.getTime();
  };


  add() {
    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Patient Payment Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.newpatientpayment = this.form.getRawValue();


      // @ts-ignore
      this.newpatientpayment.date = this.datep.transform(this.newpatientpayment.date, 'yyyy-MM-dd');
      // @ts-ignore


      if (this.cardpayment) {
        this.newpatientpayment.cardpayments = this.cardpayments;
      }

      if (this.newpatientpayment.paymentstatus.name === 'Completed') {
        console.log('payment completed');
        this.updateDrugQoh();
      }
      this.newpatientpayment

      let popdetails: string = "";

      popdetails = popdetails + "<br>Name of the Patient is : " + this.newpatientpayment.appointment.patient.name;
      // clinic = clinic + "<br>Doctor Name is : " + this.newdoctor.doctor.employee.fullname;
      popdetails = popdetails + "<br> Appointment number : " + this.newpatientpayment.appointment.number;
      popdetails = popdetails + "<br>Amount : " + this.newpatientpayment.amount;
      popdetails = popdetails + "<br>Description is : " + this.newpatientpayment.description;
      const confirm = this.dialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Patient Payment Add",
          message: "Are you sure to Add the following Patient payment  data? <br> <br>" + popdetails
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.patientpaymentservice.add(this.newpatientpayment).then((responce: [] | undefined) => {

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
              data: {heading: "Status - Patient Payment Add", message: addmessage}
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

  fillForm() {

    //@ts-ignore
    this.newpatientpayment.appointment = this.appointments.find(a => a.id === this.newpatientpayment.appointment.id);


    //@ts-ignore
    this.newpatientpayment.paymentstatus = this.paymentstatuses.find(p => p.id === this.newpatientpayment.paymentstatus.id);
    //@ts-ignore
    this.newpatientpayment.employee = this.employees.find(e => e.id === this.newpatientpayment.employee.id);
    //@ts-ignore
    // this.patient.relationship = this.relationship.find(s => s.id === this.patient.relationship.id);
    if (this.newpatientpayment.cardpayments.length > 0) {
      //@ts-ignore
      this.newpatientpayment.paytype = this.paytypes.find(p => p.id === this.newpatientpayment.paytype.id);

      this.indata = new MatTableDataSource(this.newpatientpayment.cardpayments);
    }

    console.log('update details', this.newpatientpayment)
    this.form.patchValue(this.newpatientpayment);
    this.form.markAsPristine();

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

      const errmsg = this.dialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Patient Payment Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Patient Payment Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.newpatientpayment = this.form.getRawValue();
            this.newpatientpayment.cardpayments = this.cardpayments;

            this.newpatientpayment.id = this.odlpatientpayment.id

            if (this.newpatientpayment.paymentstatus.name === 'Completed') {
              console.log('payment completed');
              this.updateDrugQoh();
            }

            this.patientpaymentservice.update(this.newpatientpayment).then((responce: [] | undefined) => {
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

              const stsmsg = this.dialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status Patient Payment Add", message: updmessage}
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
          data: {heading: "Confirmation - Patient Payment Update", message: "Nothing Changed"}
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

  clear(): void {
    const confirm = this.dialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Patient Payment Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset();
      }
    });
  }

  idd = 0;

  btnaddMc() {

    this.innerdata = this.innerform.getRawValue();
    console.log(this.innerdata);

    if (this.innerdata != null) {

      let cardpayment: Cardpayment;


      cardpayment = this.innerform.getRawValue();
      this.cardpayments.push(cardpayment);
      this.innerform.reset()

      //
      // //@ts-ignore
      // let cardpayment = new Cardpayment(tiss.idd,this.innerdata.cardnumber, this.innerdata.bank, this.innerdata.bankbranch);
      //
      //
      // let tem: Cardpayment[] = [];
      // if (this.indata != null) this.indata.data.forEach((i) => tem.push(i));
      //
      // this.cardpayments = [];
      // tem.forEach((t) => this.cardpayments.push(t));
      //
      // this.cardpayments.push(cardpayment);

      console.log(' catdpayments ', this.cardpayments)
      this.indata = new MatTableDataSource(this.cardpayments);
      //
      // this.idd++;

      this.innerform.reset();

    }

  }

  deleteRaw(x: any) {

    let datasources = this.indata.data

    const index = datasources.findIndex(m => m.id === x.id);
    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.cardpayments = this.indata.data;

  }

  backtoview() {
    this._location.back();
  }

  private updateDrugQoh() {


    this.prescriptions.map(prescript => {

    })

  }
}
