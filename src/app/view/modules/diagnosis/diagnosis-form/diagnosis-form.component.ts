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

@Component({
  selector: 'app-diagnosis-form',
  templateUrl: './diagnosis-form.component.html',
  styleUrls: ['./diagnosis-form.component.css']
})
export class DiagnosisFormComponent {

  imagedrugpurl: string = 'assets/my-img/banner/drugs.jpg'

  title: string = "Diagnosis"
  public form!: FormGroup;
  updateForm: boolean = false;
  id!: number;

  newDiagnosis!: Diagnosis;
  oldDiagnosis!: Diagnosis;

  // selectedrow: any;

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
    private severityservice:Severityservice ,
    private treatmentplanservice: Treatmentplanservice,
    private appointmentService: AppointmentService,

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


  }

  ngOnInit() {

    this.id = this.arouter.snapshot.params['id'];
    if(this.arouter.snapshot.params['id']){
      // @ts-ignore
      this.diagnosisservice.get(this.id).then((diagnosis: Diagnosis) => {
        this.oldDiagnosis = diagnosis;
        this.newDiagnosis = diagnosis;
        this.updateForm  = true;
        console.log(this.newDiagnosis);
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

    // this.doctorss.getAllList('')then((docs: Doctor[]) => {
    //   this.regexes = regs;
    //   this.createForm();
    // });
    // this.getscheduledclinic();
    // this.getcountbyclinic();
  }

  createForm() {

    this.form.controls['clinic'].setValidators([Validators.required]);
    this.form.controls['number'].setValidators([Validators.required]);
    this.form.controls['patient'].setValidators([Validators.required]);
    this.form.controls['drugstatus'].setValidators([Validators.required]);
    this.form.controls['drugtype'].setValidators([Validators.required]);
    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "dobirth" || controlName == "doassignment")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

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

      console.log(this.symptomsdiagnoses)
      console.log(this.diseasediagnoses)
      console.log(this.allergydiagnoses)

      this.newDiagnosis.diseasediagnoses = this.diseasediagnoses;
      this.newDiagnosis.symptomsdiagnoses = this.symptomsdiagnoses;
      this.newDiagnosis.allergydiagnoses = this.allergydiagnoses;


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
      console.log('thsi is from add before service call ' , this.newDiagnosis);
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
    //
    // if (this.newDrug != undefined) {
    //
    //
    //   if (this.newDrug.photo != null) {
    //     this.imagedrugpurl = atob(this.newDrug.photo);
    //     this.form.controls['photo'].clearValidators();
    //   } else {
    //     this.clearImage();
    //   }
    //   this.newDrug.photo = "";
    //
    //
    //   this.drugadverseeffects = this.newDrug.drugadverseeffects;
    //   // this.adverseeffects = this.adverseeffects.filter(ad => !this.drugadverseeffects.includes(ad));
    //   // this.adverseeffects = this.drugadverseeffects.filter(ad => !this.adverseeffects.includes(ad));
    //
    //   this.drugindications = this.newDrug.drugindications;
    //   // this.indications = this.indications.filter(ad => !this.indications.includes(ad));
    //
    //   this.drugcontraindications = this.newDrug.drugcontraindications
    //   // this.contraindications = this.contraindications.filter(ad => !this.drugcontraindications.includes(ad));
    //
    //   //@ts-ignore
    //   this.newDrug.drugroute = this.drugroutes.find(a => a.id === this.newDrug.drugroute.id);
    //   //@ts-ignore
    //   this.newDrug.drugform = this.drugforms.find(p => p.id === this.newDrug.drugform.id);
    //   //@ts-ignore
    //   this.newDrug.employee = this.employees.find(e => e.id === this.newDrug.employee.id);
    //
    //   //@ts-ignore
    //   this.newDrug.drugstatus = this.drugstatuses.find(a => a.id === this.newDrug.drugstatus.id);
    //
    //   this.form.patchValue(this.newDrug);
    //   this.form.markAsPristine();
    // }

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

    // let errors = this.getErrors();
    //
    // if (errors != "") {
    //
    //   const errmsg = this.dg.open(MessageComponent, {
    //     width: '500px',
    //     data: {heading: "Errors - " + this.title + " Update ", message: "You have following Errors <br> " + errors}
    //   });
    //   errmsg.afterClosed().subscribe(async result => {
    //     if (!result) {
    //       return;
    //     }
    //   });
    //
    // } else {
    //
    //   let updates: string = this.getUpdates();
    //
    //   if (updates != "") {
    //
    //     let updstatus: boolean = false;
    //     let updmessage: string = "Server Not Found";
    //
    //     const confirm = this.dg.open(ConfirmComponent, {
    //       width: '500px',
    //       data: {
    //         heading: "Confirmation - " + this.title + " Update",
    //         message: "Are you sure to Save following Updates? <br> <br>" + updates
    //       }
    //     });
    //     confirm.afterClosed().subscribe(async result => {
    //       if (result) {
    //         //console.log("EmployeeService.update()");
    //         this.newDrug = this.form.getRawValue();
    //         if (this.form.controls['photo'].dirty) this.newDrug.photo = btoa(this.imagedrugpurl);
    //         this.newDrug.photo = this.oldDrug.photo;
    //         this.newDrug.id = this.oldDrug.id;
    //
    //
    //         //set name and code
    //         this.newDrug.name = this.generateName(this.newDrug.brand.name, this.newDrug.generic.name, this.newDrug.strength.toString());
    //         this.newDrug.code = this.generateCode(this.newDrug.brand, this.newDrug.generic.name);
    //
    //         this.newDrug.drugadverseeffects = this.drugadverseeffects;
    //         this.newDrug.drugindications = this.drugindications;
    //         this.newDrug.drugcontraindications = this.drugcontraindications;
    //
    //
    //         console.log(this.newDrug)
    //         this.drugS.update(this.newDrug).then((responce: [] | undefined) => {
    //           if (responce != undefined) { // @ts-ignore
    //             //console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
    //             // @ts-ignore
    //             updstatus = responce['errors'] == "";
    //             //console.log("Upd Sta-" + updstatus);
    //             if (!updstatus) { // @ts-ignore
    //               updmessage = responce['errors'];
    //             }
    //           } else {
    //             //console.log("undefined");
    //             updstatus = false;
    //             updmessage = "Content Not Found"
    //           }
    //         }).finally(() => {
    //           if (updstatus) {
    //             updmessage = "Successfully Updated";
    //             this.form.reset();
    //             // this.clearImage();
    //             Object.values(this.form.controls).forEach(control => {
    //               control.markAsTouched();
    //             });
    //             // this.loadTable("");
    //           }
    //
    //           const stsmsg = this.dg.open(MessageComponent, {
    //             width: '500px',
    //             data: {heading: "Status " + this.title + " Add", message: updmessage}
    //           });
    //           stsmsg.afterClosed().subscribe(async result => {
    //             if (!result) {
    //               return;
    //             }
    //           });
    //
    //         });
    //       }
    //     });
    //   } else {
    //
    //     const updmsg = this.dg.open(MessageComponent, {
    //       width: '500px',
    //       data: {heading: "Confirmation - " + this.title + " Update", message: "Nothing Changed"}
    //     });
    //     updmsg.afterClosed().subscribe(async result => {
    //       if (!result) {
    //         return;
    //       }
    //     });
    //
    //   }
    // }


  }


  selectImage(e: any): void {
    if (e.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.imagedrugpurl = event.target.result;
        this.form.controls['photo'].clearValidators();
      }
    }
  }

  clearImage(): void {
    this.imagedrugpurl = 'assets/default.png';
    this.form.controls['photo'].setErrors({'required': true});
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
      const allergydiagnosis = new Allergydiagnosis( option.value);
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
      this. diseases = this.diseases.filter(ad => ad !== option.value); //Remove Selected
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
      const extDisease= option.value;
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


  backtoview() {
    this._location.back();
  }
}
