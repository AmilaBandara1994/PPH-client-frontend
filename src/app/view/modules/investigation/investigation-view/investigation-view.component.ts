import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Investigation} from "../../../../entity/investigation";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Employee} from "../../../../entity/employee";
import {Appointment} from "../../../../entity/appointment";
import {UiAssist} from "../../../../util/ui/ui.assist";
import {AppointmentService} from "../../../../service/appointment.service";
import {Router} from "@angular/router";
import {RegexService} from "../../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {Investigationstatus} from "../../../../entity/investigationstatus";
import {Reporttype} from "../../../../entity/reporttype";
import {Investigationresult} from "../../../../entity/investigationresult";
import {Investigationstatusservice} from "../../../../service/investigationstatusservice";
import {Reporttypeservice} from "../../../../service/reporttypeservice";
import {Investigationresultservice} from "../../../../service/investigationresultservice";
import {InvestigationService} from "../../../../service/investigationservice";
import {EmployeeService} from "../../../../service/employeeservice";

@Component({
  selector: 'app-investigation-view',
  templateUrl: './investigation-view.component.html',
  styleUrls: ['./investigation-view.component.css']
})
export class InvestigationViewComponent {
  columns: string[] = ['name', 'patientname', 'reporttype', 'requesteddate', 'investigationstatus' ,'modi'];
  headers: string[] = ['Report Name','Patient Name', 'Report Type', 'Requested Date',  'Investigation Status','Modification'];
  binders: string[] = ['name','appointment.patient.name', 'reporttype.name',  'date()','investigationstatus.name' ];

  cscolumns: string[] = ['csname', 'csfname'];
  csprompts: string[] = ['Search by Patient', 'Search by Family name' ];


  title:string = "Investigation ";


  public clinetsearch!: FormGroup;
  public serversearch!: FormGroup;

  selectedrow: any;

  investigations:Array<Investigation> =[];

  data!: MatTableDataSource<Investigation>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  employees: Array<Employee> = [];
  appointments: Array<Appointment> = [];

  investigationstatuses: Array<Investigationstatus> = [];
  reporttypes: Array<Reporttype> = [];
  investigationresults: Array<Investigationresult> = [];

  regexes: any;
  uiassist: UiAssist;

  constructor(
    private investigationstatusservice: Investigationstatusservice,
    private reporttypeservice: Reporttypeservice,
    private investigationresultservice: Investigationresultservice,
    private appointmentService: AppointmentService,
    private investigationService: InvestigationService,
    private empservice: EmployeeService,

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
      "ssseverity": new FormControl(),
      "sstreatmentplan": new FormControl(),
      "ssname": new FormControl(),
    });

  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.initialize();
  }

  initialize() {

    this.createView();

    this.empservice.getAll('').then((emp: Employee[]) => {
      this.employees = emp;
    });
    this.appointmentService.getAll('').then((appointments: Appointment[]) => {
      this.appointments = appointments;
    });
    this.investigationstatusservice.getAll().then((investigationstatuses: Investigationstatus[]) => {
      this.investigationstatuses = investigationstatuses;
    });
    this.reporttypeservice.getAll().then((reporttypes: Reporttype[]) => {
      this.reporttypes = reporttypes;
    });
    this.investigationresultservice.getAll().then((investigationresults: Investigationresult[]) => {
      this.investigationresults = investigationresults;
    })


  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string) {

    this.investigationService.getAll(query)
      .then((investigations: Investigation[]) => {
        console.log(investigations);
        this.investigations = investigations;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.investigations);
        this.data.paginator = this.paginator;
      });

  }
  date(ele:Investigation){
    return   this.datepipe.transform(new Date(ele.date), 'yyyy MM dd');
  }
  // time(ele:Investigation){
  //   return   this.datepipe.transform(new Date(ele.time), 'hh:mm a');
  // }


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

    let ssseverity = sserchdata.ssseverity;
    let sstreatmentplan = sserchdata.sstreatmentplan;
    let name = sserchdata.ssname;

    let query = "";

    if (ssseverity != null) query = query + "&severityid=" + ssseverity;
    if (sstreatmentplan != null) query = query + "&treatmentplanid=" + ssseverity;
    if (name != null) query = query + "&patientname=" + name;

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

  delete(investigation:Investigation) {
    const confirm = this.dialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - " + this.title + " Delete",
        message: "Are you sure to Delete the Investigation Data ? <br> <br>" + investigation.appointment.number
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.investigationService.delete(investigation.id).then((response: [] | undefined) => {

          if (response != undefined) { // @ts-ignore
            delstatus = response['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = response['errors'];
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
            data: {heading: "Status - " + this.title + " Deleted ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });

  }



  viewDetails(investigation:Investigation) {
    this.router.navigateByUrl('main/investigation/details/'+investigation.id);
  }

  updateclinic(investigation:Investigation) {
    this.router.navigateByUrl('main/investigation/update/'+investigation.id);
  }
}
