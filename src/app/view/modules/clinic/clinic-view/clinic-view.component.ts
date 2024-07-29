import {Component, ViewChild} from '@angular/core';
import {ClinicService} from "../../../../service/clinic.service";
import {RegexService} from "../../../../service/regexservice";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {ClinicstatusService} from "../../../../service/clinicstatus.service";
import {ClinictypeService} from "../../../../service/clinictype.service";
import {EmployeeService} from "../../../../service/employeeservice";
import {DoctorService} from "../../../../service/doctor.service";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {UiAssist} from "../../../../util/ui/ui.assist";
import {MatTableDataSource} from "@angular/material/table";
import {Clinic} from "../../../../entity/clinic";
import {MatPaginator} from "@angular/material/paginator";
import {Clinictype} from "../../../../entity/clinictype";
import {Doctor} from "../../../../entity/doctor";
import {Clinicstatus} from "../../../../entity/clinicstatus";
import {Employee} from "../../../../entity/employee";
import {Subscription} from "rxjs";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-clinic-view',
  templateUrl: './clinic-view.component.html',
  styleUrls: ['./clinic-view.component.css']
})
export class ClinicViewComponent {

  columns: string[] = ['clinictype', 'clinicstatus' ,'doctor', 'date', 'starttime', 'endtime', 'patientcount', 'modi'];
  headers: string[] = ['Clinic Type', 'Clinic Status', 'Doctor Name', 'Date', 'Start time','End Time', 'Patient Count' , 'Modification'];
  binders: string[] = ['clinictype.name', 'clinicstatus.name', 'doctor.employee.fullname', 'date' ,'starttime', 'endtime','patientcount' , 'getModi()'];

  cscolumns: string[] = ['csclinictype', 'csclinicstatus', 'csdoctor', 'csdate', 'csstarttime', 'csendtime','cspatientcount' , 'csmodi'];
  csprompts: string[] = ['Search by Clinic Type', 'Search by Clinic Status', 'Search by Doctor',
    'Search by Date', 'Search by start time', 'Search by end time','Search by Patient Count' ,'Search by Modi'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  showform:boolean = false;

  data!: MatTableDataSource<Clinic>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  uiassist: UiAssist;


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

  constructor(    private cs: ClinicService,
                  private router: Router,
                  private rs: RegexService,
                  private fb: FormBuilder,
                  private dg: MatDialog,
                  private dp: DatePipe,
                  private css: ClinicstatusService,
                  private cts: ClinictypeService,
                  private es: EmployeeService,
                  private ds: DoctorService,
                  public authService:AuthorizationManager
  ) {

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
        (csearchdata.csdoctor == null ) || clinic.doctor.employee.fullname.includes(csearchdata.csdoctor) &&
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


  delete(clinic:Clinic) {
    console.log(clinic)
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Clinic Delete",
        message: "Are you sure to Delete following Clinic ? <br> <br>" + clinic.clinictype.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.cs.delete(clinic.id).then((responce: [] | undefined) => {

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

  updateclinic(clinic:Clinic) {
    this.router.navigateByUrl('main/clinic/update/'+clinic.id);
  }
  viewDetails(clinic:Clinic) {
    this.router.navigateByUrl('main/clinic/details/'+clinic.id);
  }

}
