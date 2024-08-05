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
import {Drug} from "../../../../entity/drug";
import {Drugformservice} from "../../../../service/drugformservice";
import {Genericservice} from "../../../../service/genericservice";
import {Drugrouteservice} from "../../../../service/drugrouteservice";
import {Drugstatusservice} from "../../../../service/drugstatusservice";
import {Brandservice} from "../../../../service/brandservice";
import {Indicationservice} from "../../../../service/indicationservice";
import {Adverseeffectservice} from "../../../../service/adverseeffect.service";
import {Contraindicationservice} from "../../../../service/contraindicationservice";
import {Drugservice} from "../../../../service/drugservice";
import {Employee} from "../../../../entity/employee";
import {Drugform} from "../../../../entity/drugform";
import {Generic} from "../../../../entity/generic";
import {Drugroute} from "../../../../entity/drugroute";
import {Drugstatus} from "../../../../entity/drugstatus";
import {Brand} from "../../../../entity/brand";
import {Indication} from "../../../../entity/indication";
import {Adverseeffect} from "../../../../entity/adverseeffect";
import {Contraindication} from "../../../../entity/contraindication";

@Component({
  selector: 'app-drug-view',
  templateUrl: './drug-view.component.html',
  styleUrls: ['./drug-view.component.css']
})
export class DrugViewComponent {
  columns: string[] = ['code', 'name','strength', 'qoh', 'sprice' , 'drugroute', 'brand','modi'];
  headers: string[] = ['Code', 'Name', 'Strength',  'QOH', 'Sales Price','Drug Route', 'Brand','Modification'];
  binders: string[] = ['code', 'name',  'strength',  'qoh','sprice' , 'drugroute.name', 'brand.name'];

  cscolumns: string[] = ['csname', 'csfname'];
  csprompts: string[] = ['Search by Patient', 'Search by Family name' ];


  public clinetsearch!: FormGroup;
  public serversearch!: FormGroup;

  // olddoctor!: Doctor;

  selectedrow: any;


  drugs: Array<Drug> = [];
  employees: Array<Employee> = [];
  drugforms: Array<Drugform> = [];
  generics: Array<Generic> = [];
  drugroutes: Array<Drugroute> = [];
  drugstatuses: Array<Drugstatus> = [];
  brands: Array<Brand> = [];

  indications: Array<Indication> = [];
  adverseeffects: Array<Adverseeffect> = [];
  contraindications: Array<Contraindication> = []

  data!: MatTableDataSource<Drug>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;



  regexes: any;

  uiassist: UiAssist;

  constructor(

    private dformS: Drugformservice,
    private genericS: Genericservice,
    private drouteS: Drugrouteservice,
    private dstatusS: Drugstatusservice,
    private brandS: Brandservice,
    private indicationS: Indicationservice,
    private adverseS: Adverseeffectservice,
    private contrainS: Contraindicationservice,
    private empS: EmployeeService,
    private drugS: Drugservice,

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
      "ssdrugform": new FormControl(),
      "sscode": new FormControl(),
      "ssgeneric": new FormControl(),
      "ssname": new FormControl(),
      "ssbrand": new FormControl()
    });

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();


    this.empS.getAll('').then((emp: Employee[]) => {
      this.employees = emp;
    });
    this.dformS.getAll().then((drugforms: Drugform[]) => {
      this.drugforms = drugforms;
    });
    this.genericS.getAll().then((generics: Generic[]) => {
      this.generics = generics;
    });
    this.drouteS.getAll().then((drugroutes: Drugroute[]) => {
      this.drugroutes = drugroutes;
    })
    this.dstatusS.getAll().then((drugstatuses: Drugstatus[]) => {
      this.drugstatuses = drugstatuses;
    })

    this.brandS.getAll().then((brands: Brand[]) => {
      this.brands = brands;
    });

  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string) {

    this.drugS.getAll(query)
      .then((drugs: Drug[]) => {
        this.drugs = drugs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.drugs);
        this.data.paginator = this.paginator;
      });

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

    let genericid = sserchdata.ssgeneric;
    let drugformid = sserchdata.ssdrugform;
    let code = sserchdata.sscode;
    let name = sserchdata.ssname;
    let brandid = sserchdata.ssbrand;

    let query = "";

    if (genericid != null) query = query + "&genericid=" + genericid;
    if (drugformid != null) query = query + "&drugformid=" + drugformid;
    if (code != null) query = query + "&code=" + code;
    if (name != null) query = query + "&name=" + name;
    if (brandid != null) query = query + "&brandid=" + brandid;

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

  delete(drug:Drug) {
    console.log(drug)
    const confirm = this.dialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Drug Delete",
        message: "Are you sure to Delete the Drug ? <br> <br>" + drug.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.drugS.delete(drug.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - Drug Deleted ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });

  }



  viewDetails(drug:Drug) {
    this.router.navigateByUrl('main/drug/details/'+drug.id);
  }

  updateclinic(drug:Drug) {
    this.router.navigateByUrl('main/drug/update/'+drug.id);
  }
}
