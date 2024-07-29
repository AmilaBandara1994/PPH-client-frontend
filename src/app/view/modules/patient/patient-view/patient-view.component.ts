import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Patient} from "../../../../entity/patient";
import {Employee} from "../../../../entity/employee";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Gender} from "../../../../entity/gender";
import {Bloodgroup} from "../../../../entity/bloodgroup";
import {Relationship} from "../../../../entity/relationship";
import {Patientriskfactor} from "../../../../entity/patientriskfactor";
import {Riskfactor} from "../../../../entity/riskfactor";
import {Patientstatus} from "../../../../entity/patientstatus";
import {Empstatus} from "../../../../entity/empstatus";
import {Emptype} from "../../../../entity/emptype";
import {UiAssist} from "../../../../util/ui/ui.assist";
import {EmployeeService} from "../../../../service/employeeservice";
import {GenderService} from "../../../../service/genderservice";
import {BloodgroupService} from "../../../../service/bloodgroup.service";
import {PatientriskfactorService} from "../../../../service/patientriskfactor.service";
import {RiskfactorsService} from "../../../../service/riskfactors.service";
import {RelationshipService} from "../../../../service/relationship.service";
import {Patientservice} from "../../../../service/patientservice";
import {PatientstatusService} from "../../../../service/patientstatus.service";
import {RegexService} from "../../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-patient-view',
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.css']
})
export class PatientViewComponent {
  columns: string[] = ['name', 'nic', 'gender', 'bloodgroup', 'contactnumber', 'modi'];
  headers: string[] = ['Name', 'NIC', 'Gender', 'BloodGroup', 'Contact Number', 'Modification'];
  binders: string[] = ['name', 'nic', 'gender.name', 'bloodgroup.name', 'contactnumber', 'getModi()'];

  cscolumns: string[] = ['csname', 'cscontactnumber', 'csgender', 'csbloodgroup', 'csnic', 'csmodi'];
  csprompts: string[] = ['Search by Name', 'Search by NIC', 'Search by Gender',
    'Search by BloodGroup', 'Search by Mobile', 'Search by Modi'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  patient!: Patient;
  oldpatinet!: Patient;

  selectedrow: any;

  employees: Array<Employee> = [];
  data!: MatTableDataSource<Patient>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'

  // enaadd:boolean = false;
  // enaupd:boolean = false;
  // enadel:boolean = false;

  genders: Array<Gender> = [];
  bloodgroup: Array<Bloodgroup> = [];
  relationship: Array<Relationship> = [];
  patientriskfactor: Array<Patientriskfactor> = [];
  riskfactor: Array<Riskfactor> = [];
  patientstatus: Array<Patientstatus> = [];
  employeestatuses: Array<Empstatus> = [];
  employeetypes: Array<Emptype> = [];

  patients: Array<Patient> = [];

  regexes: any;

  uiassist: UiAssist;

  constructor(
    private es: EmployeeService,
    private gs: GenderService,
    private router:Router,
    private bg: BloodgroupService,
    private prfs: PatientriskfactorService,
    private rfs: RiskfactorsService,
    private relatinshipservice: RelationshipService,
    private ps: Patientservice,
    private pss: PatientstatusService,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService:AuthorizationManager) {


    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      "csname": new FormControl(),
      "cscontactnumber": new FormControl(),
      "csgender": new FormControl(),
      "csbloodgroup": new FormControl(),
      "csnic": new FormControl(),
      "csmodi": new FormControl(),
    });

    this.ssearch = this.fb.group({
      "sspatientstatus": new FormControl(),
      "ssbloodgroup": new FormControl(),
      "ssgender": new FormControl(),
      "sscontactnumber": new FormControl(),
      "ssnic": new FormControl()
    });


    this.form = this.fb.group({
      "name": new FormControl('', [Validators.required]),
      "dobirth": new FormControl('', [Validators.required]),
      "gender": new FormControl('', [Validators.required]),
      "nic": new FormControl('', [Validators.required]),
      "contactnumber": new FormControl('', [Validators.required]),
      "photo": new FormControl('', [Validators.required]),
      "patientstatus": new FormControl('', [Validators.required]),
      "patientriskfact": new FormControl('', [Validators.required]),
      "bloodgroup": new FormControl('', [Validators.required]),
      "relationship": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
      "email": new FormControl('', [Validators.required])
    }, {updateOn: 'change'});


  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.gs.getAllList().then((gens: Gender[]) => {
      this.genders = gens;
    });

    this.pss.getAllList().then((pstatus: Patientstatus[]) => {
      this.patientstatus = pstatus;
    });

    this.bg.getAllList().then((bgroup: Bloodgroup[]) => {
      this.bloodgroup = bgroup;
    });

    this.relatinshipservice.getAllList().then((rships: Relationship[]) => {
      this.relationship = rships;
    });

    this.prfs.getAllList().then((prfactors: Patientriskfactor[]) => {
      this.patientriskfactor = prfactors;
    });

    this.rfs.getAllList().then((rfactors: Riskfactor[]) => {
      this.riskfactor = rfactors;
    });

    this.rs.get('employee').then((regs: []) => {
      this.regexes = regs;
      // this.createForm();
    });

  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }


  // createForm() {
  //
  //   this.form.controls['number'].setValidators([Validators.required, Validators.pattern(this.regexes['number']['regex'])]);
  //   this.form.controls['fullname'].setValidators([Validators.required, Validators.pattern(this.regexes['fullname']['regex'])]);
  //   this.form.controls['callingname'].setValidators([Validators.required, Validators.pattern(this.regexes['callingname']['regex'])]);
  //   this.form.controls['gender'].setValidators([Validators.required]);
  //   this.form.controls['nic'].setValidators([Validators.required, Validators.pattern(this.regexes['nic']['regex'])]);
  //   this.form.controls['dobirth'].setValidators([Validators.required]);
  //   this.form.controls['photo'].setValidators([Validators.required]);
  //   this.form.controls['address'].setValidators([Validators.required, Validators.pattern(this.regexes['address']['regex'])]);
  //   this.form.controls['mobile'].setValidators([Validators.required, Validators.pattern(this.regexes['mobile']['regex'])]);
  //   this.form.controls['land'].setValidators([Validators.pattern(this.regexes['land']['regex'])]);
  //   this.form.controls['email'].setValidators([Validators.required,Validators.pattern(this.regexes['email']['regex'])]);
  //   this.form.controls['designation'].setValidators([Validators.required]);
  //   this.form.controls['doassignment'].setValidators([Validators.required]);
  //   this.form.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
  //   this.form.controls['emptype'].setValidators([Validators.required]);
  //   this.form.controls['empstatus'].setValidators([Validators.required]);
  //
  //   Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );
  //
  //   for (const controlName in this.form.controls) {
  //     const control = this.form.controls[controlName];
  //     control.valueChanges.subscribe(value => {
  //         // @ts-ignore
  //         if (controlName == "dobirth" || controlName == "doassignment")
  //           value = this.dp.transform(new Date(value), 'yyyy-MM-dd');
  //
  //         if (this.oldemployee != undefined && control.valid) {
  //           // @ts-ignore
  //           if (value === this.employee[controlName]) {
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
  //   // this.enableButtons(true,false,false);
  //
  // }


  // enableButtons(add:boolean, upd:boolean, del:boolean){
  //   this.enaadd=add;
  //   this.enaupd=upd;
  //   this.enadel=del;
  // }


  loadTable(query: string) {

    this.ps.getAll(query)
      .then((pati: Patient[]) => {
        this.patients = pati;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.patients);
        this.data.paginator = this.paginator;
      });

  }


  getModi(element: Employee) {
    // return element.number + '(' + element.callingname + ')';
  }


  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (patient1: Patient, filter: string) => {
      return (cserchdata.csname == null || patient1.name.toLowerCase().includes(cserchdata.csname)) &&
        (cserchdata.cscontactnumber == null || patient1.contactnumber.toLowerCase().includes(cserchdata.cscontactnumber)) &&
        (cserchdata.csgender == null || patient1.gender.name.toLowerCase().includes(cserchdata.csgender)) &&
        (cserchdata.csbloodgroup == null || patient1.bloodgroup.name.toLowerCase().includes(cserchdata.csbloodgroup)) &&
        (cserchdata.csnic == null || patient1.nic.toLowerCase().includes(cserchdata.csnic)) ;
      // (cserchdata.csmodi == null || this.getModi(patient1).toLowerCase().includes(cserchdata.csmodi));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    const sserchdata = this.ssearch.getRawValue();

    let sspatientstatus = sserchdata.sspatientstatus;
    let ssbloodgroup = sserchdata.ssbloodgroup;
    let nic = sserchdata.ssnic;
    let genderid = sserchdata.ssgender;
    let sscontactnumber = sserchdata.sscontactnumber;

    let query = "";

    if (sspatientstatus != null ) query = query + "&patientstatus=" + sspatientstatus;
    if (sscontactnumber != null && sscontactnumber.trim() != "") query = query + "&contactnumber=" + sscontactnumber;
    if (nic != null && nic.trim() != "") query = query + "&nic=" + nic;
    if (genderid != null) query = query + "&genderid=" + genderid;
    if (ssbloodgroup != null) query = query + "&bloodgroupid=" + ssbloodgroup;

    if (query != "") query = query.replace(/^./, "?")

    this.loadTable(query);

  }


  btnSearchClearMc(): void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.ssearch.reset();
        this.loadTable("");
      }
    });

  }

  selectImage(e: any): void {
    if (e.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.imageempurl = event.target.result;
        this.form.controls['photo'].clearValidators();
      }
    }
  }

  clearImage(): void {
    this.imageempurl = 'assets/default.png';
    this.form.controls['photo'].setErrors({'required': true});
  }


  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Patient Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.patient = this.form.getRawValue();

      this.patient.photo = btoa(this.imageempurl);

      let patdata: string = "";

      patdata = patdata + "<br>Name is : " + this.patient.name;
      patdata = patdata + "<br> Email is: " + this.patient.email;
      patdata = patdata + "<br> Bloodgroup is : " + this.patient.bloodgroup;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Patient Add",
          message: "Are you sure to Add the following Employee? <br> <br>" + patdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.ps.add(this.patient).then((responce: [] | undefined) => {
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
              this.clearImage();
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status - Patient Add", message: addmessage}
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

  fillForm(pati: Patient) {

    // this.enableButtons(false,true,true);

    this.selectedrow=pati;

    this.patient = JSON.parse(JSON.stringify(pati));
    this.oldpatinet = JSON.parse(JSON.stringify(pati));

    if (this.patient.photo != null) {
      this.imageempurl = atob(this.patient.photo);
      this.form.controls['photo'].clearValidators();
    } else {
      this.clearImage();
    }
    this.patient.photo = "";

    //@ts-ignore
    this.patient.gender = this.genders.find(g => g.id === this.patient.gender.id);
    //@ts-ignore
    this.patient.patientstatus = this.patientstatus.find(d => d.id === this.patient.patientstatus.id);
    //@ts-ignore
    this.patient.bloodgroup = this.bloodgroup.find(b => b.id === this.patient.bloodgroup.id);
    //@ts-ignore
    this.patient.relationship = this.relationship.find(s => s.id === this.patient.relationship.id);

    this.form.patchValue(this.patient);
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
        data: {heading: "Errors - Patient Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Patient Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("EmployeeService.update()");
            this.patient = this.form.getRawValue();
            if (this.form.controls['photo'].dirty) this.patient.photo = btoa(this.imageempurl);
            else this.patient.photo = this.oldpatinet.photo;
            this.patient.id = this.oldpatinet.id;

            this.ps.update(this.patient).then((responce: [] | undefined) => {
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
                this.clearImage();
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Patient Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Employee Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }


  }



  delete(patient:Patient) {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Patient Delete",
        message: "Are you sure to Delete following Patient? <br> <br>" + this.patient.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.ps.delete(this.patient.id).then((responce: [] | undefined) => {

          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        } ).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.form.reset();
            this.clearImage();
            Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
            this.loadTable("");
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Patient Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });
  }

  clear():void{
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Patient Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset()
      }
    });
  }

  viewDetails(patient:Patient) {
    this.router.navigateByUrl('main/patient/details/'+patient.id);
  }

  updateclinic(patient:Patient) {
    this.router.navigateByUrl('main/patient/update/'+patient.id);
  }
}
