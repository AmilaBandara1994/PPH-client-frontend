import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Doctor} from "../../../../entity/doctor";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Gender} from "../../../../entity/gender";
import {UiAssist} from "../../../../util/ui/ui.assist";
import {Router} from "@angular/router";
import {EmployeeService} from "../../../../service/employeeservice";
import {ClinictypeService} from "../../../../service/clinictype.service";
import {GenderService} from "../../../../service/genderservice";
import {RegexService} from "../../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {Clinictype} from "../../../../entity/clinictype";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {Appointment} from "../../../../entity/appointment";
import {Appointmenttype} from "../../../../entity/appointmenttype";
import {Appointmentstatus} from "../../../../entity/appointmentstatus";
import {AppointmentService} from "../../../../service/appointment.service";
import {AppointmenttypeService} from "../../../../service/appointmenttype.service";
import {AppointmentstatusService} from "../../../../service/appointmentstatus.service";
import {Clinic} from "../../../../entity/clinic";

@Component({
  selector: 'app-appointment-view',
  templateUrl: './appointment-view.component.html',
  styleUrls: ['./appointment-view.component.css']
})
export class AppointmentViewComponent {
  columns: string[] = ['Number','clinictype', 'patient', 'description', 'appointmentstatus' , 'date', 'time','modi'];
  headers: string[] = [ 'Appointment Number','Clinic Type', 'Patient Name', 'Description',  'Appointment Status', 'Date','Time', 'Modification'];
  binders: string[] = ['number','clinic.clinictype.name', 'patient.name',  'description',  'appointmentstatus.name','getDate()' , 'getTime()' ];

  cscolumns: string[] = ['csname', 'csfname'];
  csprompts: string[] = ['Search by Patient', 'Search by Family name' ];


  public clinetsearch!: FormGroup;
  public serversearch!: FormGroup;

  // appointment!: Appointment;
  // olddoctor!: Doctor;

  selectedrow: any;

  appointments: Array<Appointment> = [];
  appointmenttypes: Array<Appointmenttype> = [];
  appointmentstatuses: Array<Appointmentstatus> = [];
  clinictypes: Array<Clinictype> = [];
  genders: Array<Gender> = [];

  data!: MatTableDataSource<Appointment>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;



  regexes: any;

  uiassist: UiAssist;

  constructor(

    private appointmentservice: AppointmentService,
    private appointmenttypeservice: AppointmenttypeService,
    private appointmentstatusservice: AppointmentstatusService,

    private empservice: EmployeeService,
    private clinictypeservice: ClinictypeService,
    private genderservice: GenderService,

    private router: Router,
    private rs: RegexService,
    private formb: FormBuilder,
    private dialog: MatDialog,
    private datepipe: DatePipe,
    public authService: AuthorizationManager
  ) {
    this.uiassist = new UiAssist(this);

    this.clinetsearch = this.formb.group({
      "csname": new FormControl(),
      "csfname": new FormControl(),
    });

    this.serversearch = this.formb.group({
      "ssappointmenttype": new FormControl(),
      "ssappointmentstatus": new FormControl(),
      "ssclinictype": new FormControl(),
      "sspatient": new FormControl(),
      "ssemployee": new FormControl(),
      "ssnumber": new FormControl(),
      "ssdate": new FormControl(),
    });

  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.initialize();
  }

  initialize() {

    this.createView();

    this.genderservice.getAllList().then((gens: Gender[]) => {
      this.genders = gens;
    });
    this.clinictypeservice.getAllList().then((clinictypes:Clinictype[])=>{
      this.clinictypes = clinictypes;
    });
    this.appointmenttypeservice.getAll().then((appointmenttypes:Appointmenttype[])=>{
      this.appointmenttypes = appointmenttypes;
    })
    this.appointmentstatusservice.getAll().then((appointmentstatuses:Appointmentstatus[])=>{
      this.appointmentstatuses = appointmentstatuses;
    })

    // this.doctorss.getAllList('')then((docs: Doctor[]) => {
    //   this.regexes = regs;
    //   this.createForm();
    // });

  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string) {

    this.appointmentservice.getAll(query)
      .then((appoint: Appointment[]) => {
        this.appointments = appoint;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.appointments);
        this.data.paginator = this.paginator;
      });

  }


  getModi(element: Appointment) {
    // element.doctordegrees.map(ele =>
  }
  getTime(appo: Appointment){
    return this.datepipe.transform( appo.date, 'h:mm a');
  }
  getDate(appo: Appointment){
    return   this.datepipe.transform( appo.date, 'yyyy-MM-dd');
  }
  filterTable(): void {

    const cserchdata = this.clinetsearch.getRawValue();
    // @ts-ignore
    this.data.filterPredicate = (app: Appointment, filter: string) => {
      return
        (cserchdata.csname == null || app.patient.name.toLowerCase().includes(cserchdata.csname)) &&
        (cserchdata.csfname == null || app.patient.family.name.toLowerCase().includes(cserchdata.csfname)) ;
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    const sserchdata = this.serversearch.getRawValue();

    let appointmenttypeid = sserchdata.ssappointmenttype;
    let appointmentstatusid = sserchdata.ssappointmentstatus;
    let clinictypeid = sserchdata.ssclinictype;
    let patientid = sserchdata.sspatient;
    let date = sserchdata.ssdate;
    let number = sserchdata.ssnumber;
    let employeeid = sserchdata.ssemployee;

    let query = "";

    if (appointmenttypeid != null) query = query + "&appointmenttypeid=" + appointmenttypeid;
    if (appointmentstatusid != null) query = query + "&appointmentstatusid=" + appointmentstatusid;
    if (patientid != null) query = query + "&patientid=" + patientid;
    if (number != null) query = query + "&number=" + number;
    if (clinictypeid != null) query = query + "&clinictypeid=" + clinictypeid;
    if (date != null) query = query + "&date=" + date;
    if (employeeid != null) query = query + "&employeeid=" + employeeid;

    if (query != "") query = query.replace(/^./, "?")

    this.loadTable(query);

  }

  btnSearchClearMc() {

    const confirm = this.dialog.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.serversearch.reset();
        this.loadTable("");
      }
    });
  }

  delete(appointment:Appointment) {
    console.log(appointment)
    const confirm = this.dialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Appointment Delete",
        message: "Are you sure to Delete the Appointment ? <br> <br>" + appointment.clinic.clinictype.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.appointmentservice.delete(appointment.id).then((responce: [] | undefined) => {

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
            // Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
            this.loadTable("");
          }

          const stsmsg = this.dialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Appointment Deleted ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });

  }



  viewDetails(doctor:Doctor) {
    this.router.navigateByUrl('main/appointments/details/'+doctor.id);
  }

  updateclinic(doctor:Doctor) {
    this.router.navigateByUrl('main/appointments/update/'+doctor.id);
  }
}
