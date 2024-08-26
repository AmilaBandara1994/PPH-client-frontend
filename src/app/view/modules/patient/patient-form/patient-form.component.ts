import {Component, Input, ViewChild} from '@angular/core';
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
import {DatePipe, Location} from "@angular/common";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {ActivatedRoute} from "@angular/router";
import {MatSelectionList} from "@angular/material/list";
import {Family} from "../../../../entity/family";
import {Familyservice} from "../../../../service/familyservice";

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent {
  columns: string[] = ['name', 'nic', 'gender', 'bloodgroup', 'contactnumber', 'modi'];
  headers: string[] = ['Name', 'NIC', 'Gender', 'BloodGroup', 'Contact Number', 'Modification'];
  binders: string[] = ['name', 'nic', 'gender.name', 'bloodgroup.name', 'contactnumber', 'getModi()'];

  cscolumns: string[] = ['csname', 'cscontactnumber', 'csgender', 'csbloodgroup', 'csnic', 'csmodi'];
  csprompts: string[] = ['Search by Name', 'Search by NIC', 'Search by Gender',
    'Search by BloodGroup', 'Search by Mobile', 'Search by Modi'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  today= new Date();


  title:string= 'Patient'
  updateForm:boolean = false;
  id!: number ;


  newpatient!: Patient;
  oldpatinet!: Patient;

  selectedrow: any;

  employees: Array<Employee> = [];
  data!: MatTableDataSource<Patient>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'


  genders: Array<Gender> = [];
  bloodgroups: Array<Bloodgroup> = [];
  relationships: Array<Relationship> = [];
  families: Array<Family> = [];
  patientstatuses: Array<Patientstatus> = [];


  patientriskfactors: Array<Patientriskfactor> = [];

  @Input() riskfactors: Array<Riskfactor> = [];
  oldriskfactors: Array<Riskfactor> = [];

  @ViewChild('availablelist') availablelist!: MatSelectionList;
  @ViewChild('selectedlist') selectedlist!: MatSelectionList;

  patients: Array<Patient> = [];

  regexes: any;

  uiassist: UiAssist;

  constructor(
    private es: EmployeeService,
    private familyservice: Familyservice,
    private gs: GenderService,
    private _location: Location,
    private arouter:ActivatedRoute,
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
      "dob": new FormControl('', [Validators.required]),
      "nic": new FormControl('', [Validators.required]),
      "photo": new FormControl(),
      "description": new FormControl(),
      "contactnumber": new FormControl('', [Validators.required]),
      "patientstatus": new FormControl('', [Validators.required]),
      "gender": new FormControl('', [Validators.required]),
      "patientriskfact": new FormControl(),
      "bloodgroup": new FormControl('', [Validators.required]),
      "family": new FormControl('', [Validators.required]),
      "relationship": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
      "email": new FormControl()
    }, {updateOn: 'change'});


  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.initialize();


    this.id = this.arouter.snapshot.params['id'];
    if(this.arouter.snapshot.params['id']){
      // @ts-ignore
      this.ps.get(this.id).then((patient: Patient) => {
        this.oldpatinet = patient;
        this.newpatient = patient;
        this.updateForm  = true;
        this.fillForm();
      });

    }


  }

  initialize() {

    // this.createView();

    this.gs.getAllList().then((gens: Gender[]) => {
      this.genders = gens;
    });
    this.es.getAll('').then((employees: Employee[]) => {
      this.employees = employees;
    });
    this.pss.getAllList().then((pstatus: Patientstatus[]) => {
      this.patientstatuses = pstatus;
    });
    this.bg.getAllList().then((bgroup: Bloodgroup[]) => {
      this.bloodgroups = bgroup;
    });
    this.familyservice.getAll('').then((families: Family[]) => {
      this.families = families;
    });
    this.relatinshipservice.getAllList().then((rships: Relationship[]) => {
      this.relationships = rships;
    });
    this.rfs.getAllList().then((rfactors: Riskfactor[]) => {
      this.riskfactors = rfactors;
    });

    this.rs.get('patients').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });

  }



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

  createForm() {

    this.form.controls['name'].setValidators([Validators.required, Validators.pattern(this.regexes['name']['regex'])]);
    this.form.controls['nic'].setValidators([Validators.required, Validators.pattern(this.regexes['nic']['regex'])]);
    this.form.controls['dob'].setValidators([Validators.required]);
    this.form.controls['photo'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required]);
    this.form.controls['contactnumber'].setValidators([Validators.required, Validators.pattern(this.regexes['contactnumber']['regex'])]);
    this.form.controls['patientstatus'].setValidators([Validators.required]);
    this.form.controls['gender'].setValidators([Validators.required]);
    this.form.controls['patientriskfact'].setValidators([Validators.required]);
    this.form.controls['bloodgroup'].setValidators([Validators.required]);
    this.form.controls['family'].setValidators([Validators.required]);
    this.form.controls['relationship'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['email'].setValidators([Validators.required,Validators.pattern(this.regexes['email']['regex'])]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "dobirth" || controlName == "doassignment")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.newpatient != undefined && control.valid) {
            // @ts-ignore
            if (value === this.newpatient[controlName]) {
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

    console.log(this.newpatient);


    if (this.newpatient.photo != null) {
      this.imageempurl = atob(this.newpatient.photo);
      this.form.controls['photo'].clearValidators();
    } else {
      this.clearImage();
    }
    this.newpatient.photo = "";

    //@ts-ignore
      this.newpatient.gender = this.genders.find(s => s.id === this.newpatient.gender.id);

      //@ts-ignore
      this.newpatient.patientstatus = this.patientstatuses.find(s => s.id === this.newpatient.patientstatus.id);

      //@ts-ignore
      this.newpatient.bloodgroup = this.bloodgroups.find(s => s.id === this.newpatient.bloodgroup.id);

      //@ts-ignore
      this.newpatient.employee = this.employees.find(s => s.id === this.newpatient.employee.id);

      //@ts-ignore
      this.newpatient.family = this.families.find(s => s.id === this.newpatient.family.id);
  //@ts-ignore
      this.newpatient.relationship = this.relationships.find(s => s.id === this.newpatient.relationship.id);


      //@ts-ignore
      // this.newpatient.patientriskfactors = this.patientriskfactors.find(e => e.id === this.newpatient.patientriskfactors.id);

    this.form.patchValue(this.newpatient);
    this.form.markAsPristine();
    // }, 500);


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

      this.newpatient = this.form.getRawValue();

      console.log(this.newpatient)
      this.newpatient.photo = btoa(this.imageempurl);
      this.newpatient.patientriskfactors = this.patientriskfactors;

      let patdata: string = "";

      patdata = patdata + "<br>Name is : " + this.newpatient.name;
      patdata = patdata + "<br> Email is: " + this.newpatient.email;
      patdata = patdata + "<br> Bloodgroup is : " + this.newpatient.bloodgroup;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - " + this.title + " Add",
          message: "Are you sure to Add the following Employee? <br> <br>" + patdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.ps.add(this.newpatient).then((responce: [] | undefined) => {
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

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - " + this.title + " Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - " + this.title + " Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("EmployeeService.update()");
            this.newpatient = this.form.getRawValue();
            if (this.form.controls['photo'].dirty) this.newpatient.photo = btoa(this.imageempurl);
            else this.newpatient.photo = this.oldpatinet.photo;

            this.newpatient.patientriskfactors = this.patientriskfactors;

            this.newpatient.id = this.oldpatinet.id;

            this.ps.update(this.newpatient).then((responce: [] | undefined) => {
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
                data: {heading: "Status -" + this.title + " Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - " + this.title + " Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }


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

  // fillForm(pati: Patient) {
  //
  //   // this.enableButtons(false,true,true);
  //
  //   this.selectedrow=pati;
  //
  //   this.patient = JSON.parse(JSON.stringify(pati));
  //   this.oldpatinet = JSON.parse(JSON.stringify(pati));
  //
  //   if (this.patient.photo != null) {
  //     this.imageempurl = atob(this.patient.photo);
  //     this.form.controls['photo'].clearValidators();
  //   } else {
  //     this.clearImage();
  //   }
  //   this.patient.photo = "";
  //
  //   //@ts-ignore
  //   this.patient.gender = this.genders.find(g => g.id === this.patient.gender.id);
  //   //@ts-ignore
  //   this.patient.patientstatus = this.patientstatus.find(d => d.id === this.patient.patientstatus.id);
  //   //@ts-ignore
  //   this.patient.bloodgroup = this.bloodgroup.find(b => b.id === this.patient.bloodgroup.id);
  //   //@ts-ignore
  //   this.patient.relationship = this.relationship.find(s => s.id === this.patient.relationship.id);
  //
  //   this.form.patchValue(this.patient);
  //   this.form.markAsPristine();
  //
  // }


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


  backtoview() {
    this._location.back();
  }



  rightSelected(): void {
    this.newpatient.patientriskfactors = this.availablelist.selectedOptions.selected.map(option => {
      const patientriskfactor = new Patientriskfactor(option.value);
      this.riskfactors = this.riskfactors.filter(ad => ad !== option.value); //Remove Selected
      this.patientriskfactors.push(patientriskfactor); // Add selected to Right Side
      // this.a drugadverseeffect;
      return patientriskfactor;
    });

    this.form.controls["patientriskfact"].clearValidators();
    this.form.controls["patientriskfact"].updateValueAndValidity(); // Update status
  }

  rightAll(): void {
    this.newpatient.patientriskfactors = this.availablelist.selectAll().map(option => {
      const patientriskfactor = new Patientriskfactor( option.value);
      this.riskfactors = this.riskfactors.filter(ad => ad !== option.value);
      this.patientriskfactors.push(patientriskfactor)
      return patientriskfactor;
    });

    this.form.controls["patientriskfact"].clearValidators();
    this.form.controls["patientriskfact"].updateValueAndValidity();
  }

  leftSelected(): void {
    const selectedOptions = this.selectedlist.selectedOptions.selected; // Right Side
    for (const option of selectedOptions) {
      const extRiskfactor = option.value;
      this.patientriskfactors = this.patientriskfactors.filter(ad => {
        ad !== extRiskfactor
      }); // Remove the Selected one From Right Side
      this.riskfactors.push(extRiskfactor);
    }

  }

  leftAll(): void {
    for (let patirisk of this.patientriskfactors) this.riskfactors.push(patirisk.riskfactor);
    this.patientriskfactors = [];
  }
}
