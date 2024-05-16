import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
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
  imageempurl: string = 'assets/default.png'

  uiassist: UiAssist;


  clinics: Array<Clinic> = [];
  clinictypes: Array<Clinictype> = [];
  doctors: Array<Doctor> = [];
  clinicstatuses: Array<Clinicstatus> = [];

  constructor(    private cs: ClinicService,
                  private rs: RegexService,
                  private fb: FormBuilder,
                  private dg: MatDialog,
                  private dp: DatePipe,
                  private css: ClinicstatusService,
                  private cts: ClinictypeService,
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
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.ds.getAllList().then((docts:Doctor[]) =>{
      console.log("this is doctors ",docts);
      this.doctors = docts;
    });

    this.css.getAllList().then((cstatuses: Clinicstatus[])=>{
      console.log("this is clinicstatus", cstatuses);
      this.clinicstatuses = cstatuses;
    });

    this.cts.getAllList().then((ctypes: Clinictype[])=>{
      console.log("thsi is clinictype" ,ctypes);
      this.clinictypes = ctypes;
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
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

  clear():void{
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Employee Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset()
      }
    });
  }

}
