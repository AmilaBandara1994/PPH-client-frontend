import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Doctorpayment} from "../../../../entity/doctorpayment";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Doctorpaymentstatus} from "../../../../entity/doctorpaymentstatus";
import {Appointment} from "../../../../entity/appointment";
import {Clinictype} from "../../../../entity/clinictype";
import {UiAssist} from "../../../../util/ui/ui.assist";
import {DoctorpaymentService} from "../../../../service/doctorpaymentservice";
import {Doctorpaymentstatusservice} from "../../../../service/doctorpaymentstatusservice";
import {ClinictypeService} from "../../../../service/clinictype.service";
import {Router} from "@angular/router";
import {RegexService} from "../../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {ClinicService} from "../../../../service/clinic.service";

@Component({
  selector: 'app-doctor-payment-view',
  templateUrl: './doctor-payment-view.component.html',
  styleUrls: ['./doctor-payment-view.component.css']
})
export class DoctorPaymentViewComponent {
  columns: string[] = ['status', 'paiddate', 'total', 'doctorname', 'clinictype', 'modi'];
  headers: string[] = ['Status', 'Paid Date', 'Total Amount', 'Doctor Name', 'Clinic Type', 'mpdification'];
  binders: string[] = ['doctorpaymentstatus.name', 'paid()', 'total', 'employee.fullname', 'clinic.clinictype.name',];

  cscolumns: string[] = ['appointnumber'];
  csprompts: string[] = ['Search by Appointment number'];


  title: string = "Doctor Payment";


  public clinetsearch!: FormGroup;
  public serversearch!: FormGroup;

  selectedrow: any;

  doctorpayments: Array<Doctorpayment> = [];

  data!: MatTableDataSource<Doctorpayment>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  doctorpaymentstatuses: Array<Doctorpaymentstatus> = [];
  appointments: Array<Appointment> = [];
  clinictypes: Array<Clinictype> = [];


  regexes: any;
  uiassist: UiAssist;

  constructor(
    private doctorpaymentService: DoctorpaymentService,
    private doctorpaymentstatusservice: Doctorpaymentstatusservice,
    private clinicService: ClinicService,
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

    this.doctorpaymentService.getAll('').then((doctorpayments: Doctorpayment[]) => {
      this.doctorpayments = doctorpayments;
    })

    // this.clinic.getAllList().then((clinictypes: Clinictype[]) => {
    //   this.clinictypes = clinictypes;
    // })

    this.doctorpaymentstatusservice.getAll().then((doctorpaymentstatuses: Doctorpaymentstatus[]) => {
      this.doctorpaymentstatuses = doctorpaymentstatuses;
    })


  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string) {

    this.doctorpaymentService.getAll(query)
      .then((doctorpayments: Doctorpayment[]) => {
        this.doctorpayments = doctorpayments;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.doctorpayments);
        this.data.paginator = this.paginator;
      });

  }

  paid(ele: Doctorpayment) {
    if (ele.paiddate == null) {
      return "NOT PAID"
    } else {
      return this.datepipe.transform(new Date(ele.date), 'yyyy MM dd');
    }
  }

  // drug(ele:Doctorpayment){
  //   let out = '';
  //   ele.doctorpaymentdrugs.map(el=>{
  //     out += el.drug.name +" "
  //   })
  //   return out;
  // }
  // time(ele:Diagnosis){
  //   return   this.datepipe.transform(new Date(ele.time), 'hh:mm a');
  // }


  filterTable(): void {
    //
    // const cserchdata = this.clinetsearch.getRawValue();
    //
    //
    // // @ts-ignore
    // this.data.filterPredicate = (app: Doctorpayment, filter: string) => {
    //   return
    //   (cserchdata.appointnumber == null || app.appointment.number.toLowerCase().includes(cserchdata.appointnumber))};
    //
    // this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    const sserchdata = this.serversearch.getRawValue();

    let ssprescripstate = sserchdata.ssprescripstate;
    let ssappoitno = sserchdata.ssappoitno;
    let sspatientname = sserchdata.sspatientname;
    let ssclinictype = sserchdata.ssclinictype;

    let query = "";

    if (ssprescripstate != null) query = query + "&doctorpaymentstatusid=" + ssprescripstate;
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

  delete(doctorpayment: Doctorpayment) {
    console.log(doctorpayment)
    const confirm = this.dialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - " + this.title + " Delete",
        message: "Are you sure to Delete the Doctor Payment  ? <br> <br>" + doctorpayment.clinic.clinictype.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.doctorpaymentService.delete(doctorpayment.id).then((responce: [] | undefined) => {

          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        }).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            // Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
            this.loadTable("");
          }

          const stsmsg = this.dialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - " + this.title + " Deleted ", message: delmessage}
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


  viewDetails(doctorpayment: Doctorpayment) {
    this.router.navigateByUrl('main/payment/doctor/details/' + doctorpayment.id);
  }

  updateclinic(doctorpayment: Doctorpayment) {
    this.router.navigateByUrl('main/payment/doctor/update/' + doctorpayment.id);
  }
}
