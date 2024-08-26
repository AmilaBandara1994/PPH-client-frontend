import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Appointment} from "../../../../entity/appointment";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../../util/ui/ui.assist";
import {Router} from "@angular/router";
import {RegexService} from "../../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {Family} from "../../../../entity/family";
import {District} from "../../../../entity/district";
import {Familystatus} from "../../../../entity/familystatus";
import {DistrictService} from "../../../../service/district.service";
import {FamilystatusService} from "../../../../service/familystatus.service";
import {Familyservice} from "../../../../service/familyservice";

@Component({
  selector: 'app-family-view',
  templateUrl: './family-view.component.html',
  styleUrls: ['./family-view.component.css']
})
export class FamilyViewComponent {
  columns: string[] = ['name', 'mobile','land', 'description', 'date' , 'time','modi'];
  headers: string[] = ['Family Name', 'Mobile', 'Land',  'Description', 'Date of Register','Time','Modification'];
  binders: string[] = ['name', 'mobile',  'land',  'description','doregister' , 'time'];

  cscolumns: string[] = ['csname', 'csfname'];
  csprompts: string[] = ['Search by Patient', 'Search by Family name' ];


  title:string = "Family ";


  public clinetsearch!: FormGroup;
  public serversearch!: FormGroup;

  families: Array<Family> = [];

  selectedrow: any;

  districts: Array<District> = [];
  familystatuses: Array<Familystatus> = [];


  data!: MatTableDataSource<Family>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  regexes: any;

  uiassist: UiAssist;

  constructor(

    private districtService: DistrictService,
    private familystatusService: FamilystatusService,
    private familyservice: Familyservice,

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
    window.scrollTo(0, 0);
    this.initialize();
  }

  initialize() {

    this.createView();

    this.districtService.getAllList().then((districts: District[]) => {
      this.districts = districts;
    });
    this.familystatusService.getAllList().then((familystatuses: Familystatus[]) => {
      this.familystatuses = familystatuses;
    });

  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string) {

    this.familyservice.getAll(query)
      .then((families: Family[]) => {
        this.families = families;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.families);
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

  delete(family:Family) {
    console.log(family)
    const confirm = this.dialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - " + this.title + " Delete",
        message: "Are you sure to Delete the Family Data ? <br> <br>" + family.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.familyservice.delete(family.id).then((responce: [] | undefined) => {

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



  viewDetails(family:Family) {
    this.router.navigateByUrl('main/families/details/'+family.id);
  }

  updateclinic(family:Family) {
    this.router.navigateByUrl('main/families/update/'+family.id);
  }


}
