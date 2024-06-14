import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Clinicstatus} from "../../../entity/clinicstatus";
import {Doctor} from "../../../entity/doctor";
import {Clinic} from "../../../entity/clinic";
import {Clinictype} from "../../../entity/clinictype";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {RegexService} from "../../../service/regexservice";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {ClinicService} from "../../../service/clinic.service";
import {ClinicstatusService} from "../../../service/clinicstatus.service";
import {ClinictypeService} from "../../../service/clinictype.service";
import {DoctorService} from "../../../service/doctor.service";
import {Employee} from "../../../entity/employee";
import {EmployeeService} from "../../../service/employeeservice";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-clinic',
  templateUrl: './clinic.component.html',
  styleUrls: ['./clinic.component.css']
})
export class ClinicComponent {

  columns: string[] = ['clinictype', 'clinicstatus' ,'doctor', 'date', 'starttime', 'endtime', 'patientcount', 'modi'];
  headers: string[] = ['Clinic Type', 'Clinic Status', 'Doctor Name', 'Date', 'Start time','End Time', 'Patient Count' , 'Modification'];
  binders: string[] = ['clinictype.name', 'clinicstatus.name', 'doctor.name', 'date' ,'starttime', 'endtime','patientcount' , 'getModi()'];

  cscolumns: string[] = ['csclinictype', 'csclinicstatus', 'csdoctor', 'csdate', 'csstarttime', 'csendtime','cspatientcount' , 'csmodi'];
  csprompts: string[] = ['Search by Clinic Type', 'Search by Clinic Status', 'Search by Doctor',
    'Search by Date', 'Search by start time', 'Search by end time','Search by Patient Count' ,'Search by Modi'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  data!: MatTableDataSource<Clinic>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  uiassist: UiAssist;

  newclinic!:Clinic;
  oldClinic!:Clinic;

  regexes: any;
  selectedrow: any;

  clinics: Array<Clinic> = [];
  clinictypes: Array<Clinictype> = [];
  doctors: Array<Doctor> = [];
  doctorByClinictype: Array<Doctor> = [];
  clinicstatuses: Array<Clinicstatus> = [];
  nurses:Array<Employee> = [];
  employees:Array<Employee> = [];
  filvaluesubscribe!:Subscription;
  filformsub!:Subscription;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;


  constructor(    private cs: ClinicService,
                  private rs: RegexService,
                  private fb: FormBuilder,
                  private dg: MatDialog,
                  private dp: DatePipe,
                  private css: ClinicstatusService,
                  private cts: ClinictypeService,
                  private es: EmployeeService,
                  private ds: DoctorService,
                  public authService:AuthorizationManager) {

     this.uiassist  = new UiAssist(this);

     this.csearch = this.fb.group({
        'csclinictype': new FormControl(),
        'csclinicstatus': new FormControl(),
        'csdoctor': new FormControl(),
        'csdate': new FormControl(),
        'csstarttime': new FormControl(),
        'csendtime': new FormControl(),
        'cspatientcount': new FormControl(),
        'csmodi': new FormControl(),
     })

    this.ssearch = this.fb.group({
      "ssclinicstatus": new FormControl(),
      "ssdname": new FormControl(),
      "ssclinictype": new FormControl(),
    })

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
    })
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

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
      this.createForm();
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['starttime'].setValidators([Validators.required]);
    this.form.controls['endtime'].setValidators([Validators.required]);
    this.form.controls['patientcount'];
    this.form.controls['totalincome'];
    this.form.controls['doctorpayment'].setValidators([Validators.required]);
    this.form.controls['clinictype'].setValidators([Validators.required]);
    this.form.controls['doctor'].setValidators([Validators.required]);
    this.form.controls['nurse1'].setValidators([Validators.required]);
    this.form.controls['nurse2'];
    this.form.controls['employee'];
    this.form.controls['clinicstatus'].setValidators([Validators.required]);
    this.form.controls['dopublish'];


    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "dopublish" || controlName == "date")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');
        }
      );

    }
    this.filterDoctorByclinictype();
    this.getNurseFromEmployees();
    this.enableButtons(true,false,false);

  }



  loadTable(query: string) {

    this.cs.getAll(query)
      .then((clinic: Clinic[]) => {
        this.clinics = clinic;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.clinics);
        this.data.paginator = this.paginator;
      });



  }

  getModi(element: Clinic ) {
  }

  filterTable():void{
    const csearchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (clinic : Clinic, filter:string) =>{
      return (csearchdata.csclinictype == null ) || clinic.clinictype.name.includes(csearchdata.csclinictype) &&
        (csearchdata.csclinicstatus == null ) || clinic.clinicstatus.name.includes(csearchdata.csclinicstatus) &&
        (csearchdata.csdoctor == null ) || clinic.doctor.name.includes(csearchdata.csdoctor) &&
        (csearchdata.csdate == null ) || clinic.date.includes(csearchdata.csdate) &&
        (csearchdata.csstarttime == null ) || clinic.starttime.includes(csearchdata.csstarttime) &&
        (csearchdata.csendtime == null ) || clinic.endtime.includes(csearchdata.csendtime) ;
        // (csearchdata.cspatientcount == null ) || clinic.patientcount.(csearchdata.cspatientcount) &&
        // (csearchdata.csmodi == null ) || this.getModi(clinic).toLowerCase().includes(csearchdata.csmodi) ;
    }
    this.data.filter="xx"
  }

  btnSearchSS(){
    const ssearchdata = this.ssearch.getRawValue();
    let dname = ssearchdata.ssdname;
    let clinictype = ssearchdata.ssclinictype;
    let clinicstatus = ssearchdata.ssclinicstatus;

    let query :string = "";

    console.log(dname);
    console.log(clinicstatus);
    console.log(clinictype);

    if(dname != null &&  dname.trim() != "") query =  query + "&doctorname=" + dname;
    if(clinictype != null ) query = query + "&clinictype=" + clinictype;
    if(clinicstatus != null ) query = query + "&clinicstatus=" + clinicstatus;

    console.log('before'+ query);
    if(query != "") query = query.replace(/^./, "?");
    this.loadTable(query);
    console.log('after'+ query);
  }

  btnSSearchClear(){
    const confirm = this.dg.open(ConfirmComponent,{
      width: '500px',
      data:{
        heading: "Search Clear",
        message: "Are you sure you want to clear the search",
      }
    })
    confirm.afterClosed().subscribe(async result =>{
      if(result){
        this.ssearch.reset();
        this.loadTable('');
      }
    })
  }

  filterDoctorByclinictype(){
    // @ts-ignore
    this.filvaluesubscribe = this.form.get('clinictype')?.valueChanges.subscribe((value: Clinictype) =>{
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
      this.newclinic.starttime = "08:00:00";
      this.newclinic.endtime = "12:00:00";

      let clinic: string = "";

      clinic = clinic + "<br>Type of Clinic is : " + this.newclinic.clinictype.name;
      clinic = clinic + "<br>Doctor Name is : " + this.newclinic.doctor.name;
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
              // this.clearImage();
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
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
        this.createForm();
      }
    });
  }
  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }

  fillForm(clinic:Clinic){
    this.selectedrow = clinic;
    this.newclinic = JSON.parse(JSON.stringify(clinic));
    this.oldClinic = JSON.parse(JSON.stringify(clinic));

    this.filvaluesubscribe.unsubscribe();

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

        this.form.patchValue(this.newclinic);
        this.form.markAsPristine();

        this.enableButtons(false,true,true);
      })
    });

    // @ts-ignore
    this.newclinic.clinictype = this.clinictypes.find(cs=> cs.id === this.newclinic.clinictype.id );
    this.form.controls['clinictype'].setValue(this.newclinic.clinictype);
    this.filformsub.unsubscribe();
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
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
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

  delete() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Clinic Delete",
        message: "Are you sure to Delete following Clinic ? <br> <br>" + this.newclinic.clinictype.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.cs.delete(this.newclinic.id).then((responce: [] | undefined) => {

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
            Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
            this.loadTable("");
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Clinic Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });
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
}
