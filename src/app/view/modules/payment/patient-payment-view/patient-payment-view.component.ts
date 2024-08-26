import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Appointment} from "../../../../entity/appointment";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../../util/ui/ui.assist";
import {EmployeeService} from "../../../../service/employeeservice";
import {Router} from "@angular/router";
import {RegexService} from "../../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {Patientpayment} from "../../../../entity/patientpayment";
import {Paytype} from "../../../../entity/paytype";
import {Bank} from "../../../../entity/bank";
import {PaymentstatusService} from "../../../../service/paymentstatus.service";
import {PaytypeService} from "../../../../service/paytype.service";
import {Bankservice} from "../../../../service/bankservice";
import {Employee} from "../../../../entity/employee";
import {Patientpaymentservice} from "../../../../service/patientpaymentservice";
import {Paymentstatus} from "../../../../entity/paymentstatus";
import {Clinictype} from "../../../../entity/clinictype";
import {ClinictypeService} from "../../../../service/clinictype.service";

@Component({
  selector: 'app-patient-payment-view',
  templateUrl: './patient-payment-view.component.html',
  styleUrls: ['./patient-payment-view.component.css']
})
export class PatientPaymentViewComponent {
  columns: string[] = ['patientnic', 'patient', 'Total Amount', 'paytype','Bank' , 'date', 'time','paymentstatus','modi'];
  headers: string[] = ['Patient NIC', 'Patient Name', 'Total Amount',  'Pay Type', 'Bank','Date','Time', 'Payment Status','Modification'];
  binders: string[] = ['appointment.patient.nic', 'appointment.patient.name',  'amount',  'paytype.name', '','getDate()' , 'getTime()', 'paymentstatus.name'];

  cscolumns: string[] = ['cspatient', 'cspatientnic', 'cspamentstatus', 'csdate','cspaytype'];
  csprompts: string[] = ['Search by Patient', 'Search by Family name' ];


  public clinetsearch!: FormGroup;
  public serversearch!: FormGroup;

  title:string='Patient Payment';


  selectedrow: any;

  patientpayments: Array<Patientpayment> = [];
  paymentstatuses: Array<Paymentstatus> = [];
  paytypes: Array<Paytype> = [];
  banks: Array<Bank> = [];
  employees: Array<Employee> = [];
  clinictypes: Array<Clinictype> = [];

  data!: MatTableDataSource<Patientpayment>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;



  regexes: any;

  uiassist: UiAssist;

  constructor(

    private paymentstatusservice: PaymentstatusService,
    private paytypeservice: PaytypeService,
    private bankservice: Bankservice,
    private clinictpeservice: ClinictypeService,

    private empservice: EmployeeService,
    private patientpaymentservice: Patientpaymentservice,

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
      "sspaytype": new FormControl(),
      "sspaymenttstatus": new FormControl(),
      "ssclinictype": new FormControl(),
      "sspatientnic": new FormControl(),
      "sspatientname": new FormControl(),
      "ssappointment": new FormControl(),
      "ssappointmentnumber": new FormControl(),
      "ssdate": new FormControl(),
    });

  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.initialize();
  }

  initialize() {

    this.createView();

    this.paymentstatusservice.getAll().then((paystatus: Paymentstatus[]) => {
      this.paymentstatuses = paystatus;
    });
    this.paytypeservice.getAll().then((paytypes:Paytype[])=>{
      this.paytypes = paytypes;
    });
    this.bankservice.getAll().then((banks:Bank[])=>{
      this.banks = banks;
    })
    this.clinictpeservice.getAllList().then((clinictypes:Clinictype[])=>{
      this.clinictypes = clinictypes;
    })
    // this..getAll().then((appointmentstatuses:Appointmentstatus[])=>{
    //   this.appointmentstatuses = appointmentstatuses;
    // })

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

    this.patientpaymentservice.getAll(query)
      .then((patientpayments: Patientpayment[]) => {
        this.patientpayments = patientpayments;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.patientpayments);
        this.data.paginator = this.paginator;
      });

  }


  getModi(element: Appointment) {
    // element.doctordegrees.map(ele =>
  }
  getTime(patientpayment: Patientpayment){
    return this.datepipe.transform( patientpayment.date, 'h:mm a');
  }
  getDate(patientpayment: Patientpayment){
    return   this.datepipe.transform( patientpayment.date, 'yyyy-MM-dd');
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

    let paytypeid = sserchdata.sspaytype;
    let paymentstatusid = sserchdata.sspaymenttstatus;
    let clinictypeid = sserchdata.ssclinictype;
    let patientnic = sserchdata.sspatientnic;
    let patientname = sserchdata.sspatientname;
    let date = sserchdata.ssdate;
    let appointmentnumber = sserchdata.ssappointmentnumber;
    let appointmentid = sserchdata.ssappointment;

    let query = "";

    if (paytypeid != null) query = query + "&paytypeid=" + paytypeid;
    if (paymentstatusid != null) query = query + "&paymentstatusid=" + paymentstatusid;
    if (patientnic != null) query = query + "&patientnic=" + patientnic;
    if (patientname != null) query = query + "&patientname=" + patientname;
    if (clinictypeid != null) query = query + "&clinictypeid=" + clinictypeid;
    if (date != null) query = query + "&date=" + date;
    if (appointmentnumber != null) query = query + "&appointmentnumber=" + appointmentnumber;
    if (appointmentid != null) query = query + "&appointmentid=" + appointmentid;

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

  delete(patientpay:Patientpayment) {
    console.log(patientpay)
    const confirm = this.dialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Patient Payment Delete",
        message: "Are you sure to Delete the Patient Payment  of patient ? <br> <br>" + patientpay.appointment.patient.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.patientpaymentservice.delete(patientpay.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - Patient Payment Deleted ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });

  }



  viewDetails(patientpayment:Patientpayment) {
    this.router.navigateByUrl('main/payment/patient/details/'+patientpayment.id);
  }

  updateclinic(patientpayment:Patientpayment) {
    this.router.navigateByUrl('main/payment/patient/update/'+patientpayment.id);
  }
}
