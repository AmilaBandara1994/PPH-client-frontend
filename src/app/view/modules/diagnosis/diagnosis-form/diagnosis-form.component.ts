import {Component, Input, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Employee} from "../../../../entity/employee";
import {MatSelectionList} from "@angular/material/list";
import {EmployeeService} from "../../../../service/employeeservice";
import {DatePipe, Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {RegexService} from "../../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {Diagnosis} from "../../../../entity/diagnosis";
import {Disease} from "../../../../entity/disease";
import {Symptoms} from "../../../../entity/symptoms";
import {Allergy} from "../../../../entity/allergy";
import {Diagnosisstatus} from "../../../../entity/diagnosisstatus";
import {Severity} from "../../../../entity/severity";
import {Treatmentplan} from "../../../../entity/treatmentplan";
import {Diseasediagnosis} from "../../../../entity/diseasediagnosis";
import {Symptomsdiagnosis} from "../../../../entity/symptomsdiagnosis";
import {Allergydiagnosis} from "../../../../entity/allergydiagnosis";
import {Diseaseservice} from "../../../../service/diseaseservice";
import {Symptomsservice} from "../../../../service/symptomsservice";
import {Allergyservice} from "../../../../service/allergyservice";
import {Diagnosisstatusservice} from "../../../../service/diagnosisstatusservice";
import {Severityservice} from "../../../../service/severityservice";
import {Treatmentplanservice} from "../../../../service/treatmentplanservice";
import {Diagnosisservice} from "../../../../service/diagnosisservice";
import {Appointment} from "../../../../entity/appointment";
import {AppointmentService} from "../../../../service/appointment.service";
import {MatTableDataSource} from "@angular/material/table";
import {UiAssist} from "../../../../util/ui/ui.assist";
import {Investigation} from "../../../../entity/investigation";
import {Investigationstatus} from "../../../../entity/investigationstatus";
import {Reporttype} from "../../../../entity/reporttype";
import {Investigationresult} from "../../../../entity/investigationresult";
import {Investigationstatusservice} from "../../../../service/investigationstatusservice";
import {Reporttypeservice} from "../../../../service/reporttypeservice";
import {Investigationresultservice} from "../../../../service/investigationresultservice";

@Component({
  selector: 'app-diagnosis-form',
  templateUrl: './diagnosis-form.component.html',
  styleUrls: ['./diagnosis-form.component.css']
})
export class DiagnosisFormComponent {
  //
  // incolumns: string[] = ['name','reporttype', 'description', 'investigationstatus', 'remove'];
  // inheaders: string[] = ['Name','Report Type', 'Description', 'Investigation Status', 'Remove',];
  // inbinders: string[] = ['name','reporttype.name', 'description','investigationstatus.name', 'getBtn()'];
  //

  imagedrugpurl: string = 'assets/my-img/banner/drugs.jpg'

  title: string = "Diagnosis"
  public form!: FormGroup;
  public innerform!: FormGroup;

  updateForm: boolean = false;
  id!: number;

  newDiagnosis!: Diagnosis;
  oldDiagnosis!: Diagnosis;

  // innerdata: any;
  // investigations: Array<Investigation> = [];
  // indata!: MatTableDataSource<Investigation>
  // uiassist: UiAssist;
  //
  // // investigation inner table
  //
  //
  // investigationstatuses: Array<Investigationstatus> = [];
  // reporttypes: Array<Reporttype> = [];
  // investigationresults: Array<Investigationresult> = [];



  employees: Array<Employee> = [];
  appointments: Array<Appointment> = [];
  diagnosisstatuses: Array<Diagnosisstatus> = [];
  severities: Array<Severity> = [];
  treatmentplans: Array<Treatmentplan> = [];

  diseasediagnoses: Array<Diseasediagnosis> = [];
  symptomsdiagnoses: Array<Symptomsdiagnosis> = [];
  allergydiagnoses: Array<Allergydiagnosis> = [];


  regexes: any;

  @Input() diseases: Array<Disease> = [];
  olddiseases: Array<Disease> = [];

  @Input() symptoms: Array<Symptoms> = [];
  oldsymptoms: Array<Symptoms> = [];

  @Input() allergies: Array<Allergy> = [];
  oldallergies: Array<Allergy> = [];

  // @Input() selecteddrugadverseeffs: Array<Drugadverseeffect> = [];

  @ViewChild('availablelist1') availablelist1!: MatSelectionList;
  @ViewChild('selectedlist1') selectedlist1!: MatSelectionList;

  @ViewChild('availablelist2') availablelist2!: MatSelectionList;
  @ViewChild('selectedlist2') selectedlist2!: MatSelectionList;

  @ViewChild('availablelist3') availablelist3!: MatSelectionList;
  @ViewChild('selectedlist3') selectedlist3!: MatSelectionList;

  constructor(
    private diseaseservice: Diseaseservice,
    private symptomsservice: Symptomsservice,
    private allergyservice: Allergyservice,
    private diagnosisservice: Diagnosisservice,
    private diagnosisstatusservice: Diagnosisstatusservice,
    private severityservice: Severityservice,
    private treatmentplanservice: Treatmentplanservice,
    private appointmentService: AppointmentService,
    private empS: EmployeeService,

    // inner table
    private investigationstatusservice: Investigationstatusservice,
    private reporttypeservice: Reporttypeservice,
    private investigationresultservice: Investigationresultservice,


    private _location: Location,
    private arouter: ActivatedRoute,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService: AuthorizationManager) {

    // this.uiassist = new UiAssist(this);

    this.form = this.fb.group({
      "appointment": new FormControl('', [Validators.required]),
      "onsetduration": new FormControl('', [Validators.required]),
      "disease": new FormControl('', [Validators.required]),
      "bplevel": new FormControl(),
      "bloodpresure": new FormControl('', [Validators.required]),
      "severity": new FormControl('', [Validators.required]),
      "heartrate": new FormControl('', [Validators.required]),
      "temperature": new FormControl('', [Validators.required]),
      "respiratoryrate": new FormControl('', [Validators.required]),
      "height": new FormControl('', [Validators.required]),
      "weight": new FormControl('', [Validators.required]),
      "treatmentplan": new FormControl('', [Validators.required]),
      "examination": new FormControl('', [Validators.required]),
      "allergy": new FormControl('', [Validators.required]),
      "medicalhistory": new FormControl('', [Validators.required]),
      "surgicalhistory": new FormControl('', [Validators.required]),
      "doctornote": new FormControl('', [Validators.required]),
      "diagnosisstatus": new FormControl('', [Validators.required]),


      "diseasediagnoses": new FormControl(),
      "symptomsdiagnoses": new FormControl(),
      "allergydiagnoses": new FormControl(),

      // "photo": new FormControl(),
      "description": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

    // this.innerform = this.fb.group({
    //   "reporttype": new FormControl('', [Validators.required]),
    //   "description": new FormControl(),
    // }, {updateOn: 'change'});



  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.id = this.arouter.snapshot.params['id'];
    if (this.arouter.snapshot.params['id']) {

      this.diagnosisservice.get(this.id).then((diagnosis: Diagnosis | undefined) => {
        if (diagnosis != undefined) {
          this.oldDiagnosis = diagnosis;
          this.newDiagnosis = diagnosis;
        }
        this.updateForm = true;
        console.log('diakdjfdf ', diagnosis);
        this.fillForm();
      });

    }


    this.initialize();
  }

  initialize() {

    this.empS.getAll('').then((emp: Employee[]) => {
      this.employees = emp;
    })

    this.diagnosisstatusservice.getAll().then((diagnosisstatuses: Diagnosisstatus[]) => {
      this.diagnosisstatuses = diagnosisstatuses;
    });
    this.appointmentService.getAll('').then((appointments: Appointment[]) => {
      this.appointments = appointments;
    });
    this.severityservice.getAll().then((severities: Severity[]) => {
      this.severities = severities;
    });
    this.treatmentplanservice.getAll().then((treatmentplans: Treatmentplan[]) => {
      this.treatmentplans = treatmentplans;
    })


    this.diseaseservice.getAll().then((diseases: Disease[]) => {
      this.diseases = diseases;
    })

    this.symptomsservice.getAll().then((symptoms: Symptoms[]) => {
      this.symptoms = symptoms;
    });
    this.allergyservice.getAll().then((allergies: Allergy[]) => {
      this.allergies = allergies;
    });


    // this.investigationstatusservice.getAll().then((investigationstatuses: Investigationstatus[]) => {
    //   this.investigationstatuses = investigationstatuses;
    // });
    // this.reporttypeservice.getAll().then((reporttypes: Reporttype[]) => {
    //   this.reporttypes = reporttypes;
    // });
    // this.investigationresultservice.getAll().then((investigationresults: Investigationresult[]) => {
    //   this.investigationresults = investigationresults;
    // })


    this.rs.get("diagnoses").then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });

  }

  createForm() {

    this.form.controls['appointment'].setValidators([Validators.required]);
    this.form.controls['onsetduration'].setValidators([Validators.required]);
    this.form.controls['disease'].setValidators([Validators.required]);
    this.form.controls['bloodpresure'].setValidators([Validators.required, Validators.pattern(this.regexes['bloodpresure']['regex'])]);
    this.form.controls['severity'].setValidators([Validators.required]);
    this.form.controls['heartrate'].setValidators([Validators.required, Validators.pattern(this.regexes['heartrate']['regex'])]);
    this.form.controls['temperature'].setValidators([Validators.required, Validators.pattern(this.regexes['temperature']['regex'])]);
    this.form.controls['respiratoryrate'].setValidators([Validators.required, Validators.pattern(this.regexes['respiratoryreate']['regex'])]);

    this.form.controls['height'].setValidators([Validators.required, Validators.pattern(this.regexes['height']['regex'])]);
    this.form.controls['weight'].setValidators([Validators.required, Validators.pattern(this.regexes['weight']['regex'])]);
    this.form.controls['treatmentplan'].setValidators([Validators.required]);
    this.form.controls['examination'].setValidators([Validators.required]);
    this.form.controls['allergy'].setValidators([Validators.required]);
    this.form.controls['medicalhistory'].setValidators([Validators.required]);
    this.form.controls['surgicalhistory'].setValidators([Validators.required]);
    this.form.controls['doctornote'].setValidators([Validators.required]);

    this.form.controls['diagnosisstatus'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.newDiagnosis != undefined && control.valid) {
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

  generateName(reporttype: string) {
    return reporttype + "-" + this.dp.transform( new Date(), 'yyMMddhhmm');
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
      this.newDiagnosis = this.form.getRawValue();

      this.newDiagnosis.diseasediagnoses = this.diseasediagnoses;
      this.newDiagnosis.symptomsdiagnoses = this.symptomsdiagnoses;
      this.newDiagnosis.allergydiagnoses = this.allergydiagnoses;

      //inner table add
      // this.newDiagnosis.investigations = this.investigations;


      let formdata: string = "";

      formdata = formdata + "<br>  Patient Name : " + this.newDiagnosis.appointment.patient.name;
      formdata = formdata + "<br> Disease : " + this.newDiagnosis.disease;
      formdata = formdata + "<br> Allergy  : " + this.newDiagnosis.allergy;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - " + this.title + " Add",
          message: "Are you sure to Add the following " + this.title + " Data ? <br> <br>" + formdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";
      console.log('thsi is from add before service call ', this.newDiagnosis);
      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.diagnosisservice.add(this.newDiagnosis).then((responce: [] | undefined) => {
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

  // btnaddMc() {
  //   this.innerdata = this.innerform.getRawValue();
  //   if (this.innerdata != null) {
  //     let investstatus = this.investigationstatuses.filter(val => val.id = 1);
  //     let investig = new Investigation(
  //       this.innerdata.reporttype,
  //       this.innerdata.description,
  //     );
  //
  //     investig.name = this.generateName(this.innerdata.reporttype.name);
  //     investig.date = new Date();
  //     investig.investigationstatus = investstatus[0];
  //     investig.employee = this.employees[3];
  //
  //     let tem: Investigation[] = [];
  //     if (this.indata != null) this.indata.data.forEach((i) => tem.push(i));
  //
  //     this.investigations = [];
  //     tem.forEach((t) => this.investigations.push(t));
  //     this.investigations.push(investig);
  //     console.log(this.investigations)
  //     this.indata = new MatTableDataSource(this.investigations);
  //     this.innerform.reset();
  //   }
  //
  // }




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

    if (this.newDiagnosis != undefined) {


      //@ts-ignore
      this.newDiagnosis.appointment = this.appointments.find(a => a.id === this.newDiagnosis.appointment.id);
      //@ts-ignore
      this.newDiagnosis.severity = this.severities.find(p => p.id === this.newDiagnosis.severity.id);
      //@ts-ignore
      this.newDiagnosis.treatmentplan = this.treatmentplans.find(e => e.id === this.newDiagnosis.treatmentplan.id);

      //@ts-ignore
      this.newDiagnosis.diagnosisstatus = this.diseasediagnoses.find(a => a.id === this.newDiagnosis.diagnosisstatus.id);
      //@ts-ignore
      this.newDiagnosis.employee = this.employees.find(a => a.id === this.newDiagnosis.employee.id);

      this.form.patchValue(this.newDiagnosis);
      this.form.markAsPristine();
    }

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

            this.newDiagnosis = this.form.getRawValue();
            // this.newDiagnosis.investigations = this.investigations;


            this.newDiagnosis.id = this.oldDiagnosis.id;

            //set name and code

            console.log(this.newDiagnosis)
            this.diagnosisservice.update(this.newDiagnosis).then((responce: [] | undefined) => {
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

  alrightSelected(): void {
    this.availablelist3.selectedOptions.selected.map(option => {
      console.log(option.value)
      const allergydiagnosis = new Allergydiagnosis(option.value);
      this.allergies = this.allergies.filter(ad => ad !== option.value); //Remove Selected
      this.allergydiagnoses.push(allergydiagnosis); // Add selected to Right Side
      console.log(this.allergydiagnoses)
    });

    this.form.controls["allergydiagnoses"].clearValidators();
    this.form.controls["allergydiagnoses"].updateValueAndValidity(); // Update status
  }

  alrightAll(): void {
    this.availablelist3.selectAll().map(option => {
      console.log(option.value)
      const allergydiagnosis = new Allergydiagnosis(option.value);
      this.allergies = this.allergies.filter(ad => ad !== option.value);
      this.allergydiagnoses.push(allergydiagnosis);
      console.log(this.allergydiagnoses)
    });

    this.form.controls["allergydiagnoses"].clearValidators();
    this.form.controls["allergydiagnoses"].updateValueAndValidity();
  }

  alleftSelected(): void {
    const selectedOptions = this.selectedlist3.selectedOptions.selected; // Right Sideconsole.log(option)
    for (const option of selectedOptions) {
      const extAllergy = option.value;
      this.allergydiagnoses = this.allergydiagnoses.filter(ad => {
        ad !== extAllergy
      }); // Remove the Selected one From Right Side
      this.allergies.push(extAllergy);
    }

  }

  alleftAll(): void {
    for (let aller of this.allergydiagnoses) this.allergies.push(aller.allergy);
    this.allergydiagnoses = [];
  }

  syrightSelected(): void {
    this.availablelist2.selectedOptions.selected.map(option => {
      console.log(option)
      const symptomsdiagnosis = new Symptomsdiagnosis(option.value);
      this.symptoms = this.symptoms.filter(ad => ad !== option.value); //Remove Selected
      this.symptomsdiagnoses.push(symptomsdiagnosis); // Add selected to Right Side
    });

    this.form.controls["symptomsdiagnoses"].clearValidators();
    this.form.controls["symptomsdiagnoses"].updateValueAndValidity(); // Update status
  }

  syrightAll(): void {
    this.availablelist2.selectAll().map(option => {
      const symptomsdiagnosis = new Symptomsdiagnosis(option.value);
      this.symptoms = this.symptoms.filter(ad => ad !== option.value);
      this.symptomsdiagnoses.push(symptomsdiagnosis);
    });
    this.form.controls["symptomsdiagnoses"].clearValidators();
    this.form.controls["symptomsdiagnoses"].updateValueAndValidity();
  }

  syleftSelected(): void {
    const selectedOptions = this.selectedlist2.selectedOptions.selected; // Right Side
    for (const option of selectedOptions) {
      const extSymptom = option.value;
      this.symptomsdiagnoses = this.symptomsdiagnoses.filter(ad => {
        ad !== extSymptom
      }); // Remove the Selected one From Right Side
      this.symptoms.push(extSymptom.indication);
    }

  }

  syleftAll(): void {
    for (let sympdis of this.symptomsdiagnoses) this.symptoms.push(sympdis.symptoms);
    this.symptomsdiagnoses = [];
  }


  dirightSelected(): void {
    this.availablelist1.selectedOptions.selected.map(option => {
      const diseasediagnosis = new Diseasediagnosis(option.value);
      this.diseases = this.diseases.filter(ad => ad !== option.value); //Remove Selected
      this.diseasediagnoses.push(diseasediagnosis); // Add selected to Right Side
    });

    this.form.controls["diseasediagnoses"].clearValidators();
    this.form.controls["diseasediagnoses"].updateValueAndValidity(); // Update status
  }

  dirightAll(): void {
    this.availablelist1.selectAll().map(option => {
      const diseasediagnosis = new Diseasediagnosis(option.value);
      this.diseases = this.diseases.filter(ad => ad !== option.value);
      this.diseasediagnoses.push(diseasediagnosis);
    });
    this.form.controls["diseasediagnoses"].clearValidators();
    this.form.controls["diseasediagnoses"].updateValueAndValidity();
  }

  dileftSelected(): void {
    const selectedOptions = this.selectedlist1.selectedOptions.selected; // Right Side
    for (const option of selectedOptions) {
      const extDisease = option.value;
      this.diseasediagnoses = this.diseasediagnoses.filter(ad => {
        ad !== extDisease
      }); // Remove the Selected one From Right Side
      this.diseases.push(extDisease);
    }

  }

  dileftAll(): void {
    for (let diadi of this.diseasediagnoses) this.diseases.push(diadi.disease);
    this.diseasediagnoses = [];
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
  // deleteRaw(x: any) {
  //
  //   let datasources = this.indata.data
  //
  //   const index = datasources.findIndex(m => m.id === x.id);
  //   if (index > -1) {
  //     datasources.splice(index, 1);
  //   }
  //   this.indata.data = datasources;
  //   this.investigations = this.indata.data;
  //
  //
  // }


  backtoview() {
    this._location.back();
  }
}
