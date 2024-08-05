import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../../util/ui/ui.assist";
import {Router} from "@angular/router";
import {RegexService} from "../../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {Appointment} from "../../../../entity/appointment";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {Diagnosisstatus} from "../../../../entity/diagnosisstatus";
import {Severity} from "../../../../entity/severity";
import {Treatmentplan} from "../../../../entity/treatmentplan";
import {Diagnosis} from "../../../../entity/diagnosis";
import {Diagnosisservice} from "../../../../service/diagnosisservice";
import {Severityservice} from "../../../../service/severityservice";
import {Treatmentplanservice} from "../../../../service/treatmentplanservice";
import {AppointmentService} from "../../../../service/appointment.service";
import {Employee} from "../../../../entity/employee";

@Component({
  selector: 'app-diagnosis-veiw',
  templateUrl: './diagnosis-veiw.component.html',
  styleUrls: ['./diagnosis-veiw.component.css']
})
export class DiagnosisVeiwComponent {
  columns: string[] = ['patinetname', 'bpl','heartrate', 'temperature', 'date' , 'time','severity','modi'];
  headers: string[] = ['Patient Name', 'Blood Pressure', 'Heart Rate',  'Temperature', 'Date','Time','Severity','Modification'];
  binders: string[] = ['appointment.patient.name', 'bloodpresure',  'heartrate','temperature' , 'date()','time()','severity.name'];

  cscolumns: string[] = ['csname', 'csfname'];
  csprompts: string[] = ['Search by Patient', 'Search by Family name' ];


  title:string = "Diagnosis ";


  public clinetsearch!: FormGroup;
  public serversearch!: FormGroup;

  selectedrow: any;

  diagnoses:Array<Diagnosis> =[];

  data!: MatTableDataSource<Diagnosis>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  employees: Array<Employee> = [];
  appointments: Array<Appointment> = [];
  diagnosisstatuses: Array<Diagnosisstatus> = [];
  severities: Array<Severity> = [];
  treatmentplans: Array<Treatmentplan> = [];

  regexes: any;
  uiassist: UiAssist;

  constructor(
    private severityservice:Severityservice ,
    private treatmentplanservice: Treatmentplanservice,
    private appointmentService: AppointmentService,
    private diagnosisservice: Diagnosisservice,

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
    this.initialize();
  }

  initialize() {

    this.createView();

    this.appointmentService.getAll('').then((appointments: Appointment[]) => {
      this.appointments = appointments;
    });
    this.severityservice.getAll().then((severities: Severity[]) => {
      this.severities = severities;
    });
    this.treatmentplanservice.getAll().then((treatmentplans: Treatmentplan[]) => {
      this.treatmentplans = treatmentplans;
    })

  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string) {

    this.diagnosisservice.getAll(query)
      .then((diagnoses: Diagnosis[]) => {
        this.diagnoses = diagnoses;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.diagnoses);
        this.data.paginator = this.paginator;
      });

  }
  date(ele:Diagnosis){
    return   this.datepipe.transform(new Date(ele.time), 'yyyy MM dd');
  }
  time(ele:Diagnosis){
    return   this.datepipe.transform(new Date(ele.time), 'hh:mm a');
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

  delete(diagnosis:Diagnosis) {
    console.log(diagnosis)
    const confirm = this.dialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - " + this.title + " Delete",
        message: "Are you sure to Delete the Diagnosis Data ? <br> <br>" + diagnosis.appointment.number
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.diagnosisservice.delete(diagnosis.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - " + this.title + " Deleted ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });

  }



  viewDetails(diagnosis:Diagnosis) {
    this.router.navigateByUrl('main/diagnosis/details/'+diagnosis.id);
  }

  updateclinic(diagnosis:Diagnosis) {
    this.router.navigateByUrl('main/diagnosis/update/'+diagnosis.id);
  }
}
