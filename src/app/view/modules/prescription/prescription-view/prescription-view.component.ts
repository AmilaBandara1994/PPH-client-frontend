import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Diagnosis} from "../../../../entity/diagnosis";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Appointment} from "../../../../entity/appointment";
import {UiAssist} from "../../../../util/ui/ui.assist";
import {Treatmentplanservice} from "../../../../service/treatmentplanservice";
import {Router} from "@angular/router";
import {RegexService} from "../../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {Prescription} from "../../../../entity/prescription";
import {PrescriptionService} from "../../../../service/prescriptionservice";

@Component({
  selector: 'app-prescription-view',
  templateUrl: './prescription-view.component.html',
  styleUrls: ['./prescription-view.component.css']
})
export class PrescriptionViewComponent {
  columns: string[] = ['appointment', 'presstate','date','drug'];
  headers: string[] = ['Appointment', 'Prescription Status', 'Date','Drug'];
  binders: string[] = ['appointment.number', 'prescriptionstatus.name',  'date()', 'drug()'];

  cscolumns: string[] = ['csname', 'csfname'];
  csprompts: string[] = ['Search by Patient', 'Search by Family name' ];


  title:string = "Prescription";


  public clinetsearch!: FormGroup;
  public serversearch!: FormGroup;

  selectedrow: any;

  prescriptions:Array<Prescription> =[];

  data!: MatTableDataSource<Prescription>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;



  regexes: any;
  uiassist: UiAssist;

  constructor(
    private prescriptionService:PrescriptionService ,
    private treatmentplanservice: Treatmentplanservice,

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

    // this.prescriptionService.getAll('').then((prescriptions: Prescription[]) => {
    //   this.prescriptions = prescriptions;
    // })

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
