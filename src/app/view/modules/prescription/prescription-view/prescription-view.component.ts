import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Appointment} from "../../../../entity/appointment";
import {UiAssist} from "../../../../util/ui/ui.assist";
import {Router} from "@angular/router";
import {RegexService} from "../../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {Prescription} from "../../../../entity/prescription";
import {PrescriptionService} from "../../../../service/prescriptionservice";
import {Prescriptionstatus} from "../../../../entity/prescriptionstatus";
import {Clinictype} from "../../../../entity/clinictype";
import {ClinictypeService} from "../../../../service/clinictype.service";
import {Prescriptionstatusservice} from "../../../../service/prescriptionstatusservice";

@Component({
  selector: 'app-prescription-view',
  templateUrl: './prescription-view.component.html',
  styleUrls: ['./prescription-view.component.css']
})
export class PrescriptionViewComponent {
  columns: string[] = ['appointment', 'presstate', 'clinictype', 'date','drug', 'modi'];
  headers: string[] = ['Appointment', 'Prescription Status','Clinic Type', 'Date','Drug',''];
  binders: string[] = ['appointment.number', 'prescriptionstatus.name', 'appointment.clinic.clinictype.name', 'date()', 'drug()'];

  cscolumns: string[] = ['appointnumber'];
  csprompts: string[] = ['Search by Appointment number'];


  title:string = "Prescription";


  public clinetsearch!: FormGroup;
  public serversearch!: FormGroup;

  selectedrow: any;

  prescriptions:Array<Prescription> =[];

  data!: MatTableDataSource<Prescription>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  prescriptionstatuses: Array<Prescriptionstatus> = [];
  appointments: Array<Appointment> = [];
  clinictypes: Array<Clinictype> = [];


  regexes: any;
  uiassist: UiAssist;

  constructor(
    private prescriptionService:PrescriptionService ,
    private prescriptionstatusservice:Prescriptionstatusservice ,
    private clinictypeService: ClinictypeService,

    private router: Router,
    private rs: RegexService,
    private formb: FormBuilder,
    private dialog: MatDialog,
    private datepipe: DatePipe,
    public authService: AuthorizationManager
  ) {
    this.uiassist = new UiAssist(this);

    this.clinetsearch = this.formb.group({
      "appointnumber": new FormControl(),
    });

    this.serversearch = this.formb.group({
      "ssprescripstate": new FormControl(),
      // "ssdate": new FormControl(),
      "ssappoitno": new FormControl(),
      "sspatientname": new FormControl(),
      "ssclinictype": new FormControl(),
    });

  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.initialize();
  }

  initialize() {

    this.createView();

    this.prescriptionService.getAll('').then((prescriptions: Prescription[]) => {
      this.prescriptions = prescriptions;
    })

    this.clinictypeService.getAllList().then((clinictypes: Clinictype[]) => {
      this.clinictypes = clinictypes;
    })

    this.prescriptionstatusservice.getAll().then((prescriptionstatuses: Prescriptionstatus[]) => {
      this.prescriptionstatuses = prescriptionstatuses;
    })


  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string) {

    this.prescriptionService.getAll(query)
      .then((prescriptions: Prescription[]) => {
        this.prescriptions = prescriptions;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.prescriptions);
        this.data.paginator = this.paginator;
      });

  }
  date(ele:Prescription){
    return   this.datepipe.transform(new Date(ele.date), 'yyyy MM dd');
  }
  drug(ele:Prescription){
    let out = '';
    ele.prescriptiondrugs.map(el=>{
      out += el.drug.name +" "
    })
    return out;
  }
  // time(ele:Diagnosis){
  //   return   this.datepipe.transform(new Date(ele.time), 'hh:mm a');
  // }


  filterTable(): void {

    const cserchdata = this.clinetsearch.getRawValue();


    // @ts-ignore
    this.data.filterPredicate = (app: Prescription, filter: string) => {
      return
      (cserchdata.appointnumber == null || app.appointment.number.toLowerCase().includes(cserchdata.appointnumber))};

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    const sserchdata = this.serversearch.getRawValue();

    let ssprescripstate = sserchdata.ssprescripstate;
    let ssappoitno = sserchdata.ssappoitno;
    let sspatientname = sserchdata.sspatientname;
    let ssclinictype = sserchdata.ssclinictype;

    let query = "";

    if (ssprescripstate != null) query = query + "&prescriptionstatusid=" + ssprescripstate;
    if (ssclinictype != null) query = query + "&clinictypeid=" + ssclinictype;
    if (ssappoitno != null) query = query + "&appointmentnumber=" + ssappoitno;
    if (sspatientname != null) query = query + "&sspatientname=" + sspatientname;
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

  delete(prescription:Prescription) {
    console.log(prescription)
    const confirm = this.dialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - " + this.title + " Delete",
        message: "Are you sure to Delete the Presciption  Data related to appointment number ? <br> <br>" + prescription.appointment.number
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.prescriptionService.delete(prescription.id).then((responce: [] | undefined) => {

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



  viewDetails(prescription:Prescription) {
    this.router.navigateByUrl('main/prescription/details/'+prescription.id);
  }

  updateclinic(prescription:Prescription) {
    this.router.navigateByUrl('main/prescription/update/'+prescription.id);
  }
}
