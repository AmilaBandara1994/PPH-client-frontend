import {Component, ViewChild} from '@angular/core';
import {Brand} from "../../../../../entity/brand";
import {Generic} from "../../../../../entity/generic";
import {Drugstatus} from "../../../../../entity/drugstatus";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {DrugByBrandAndStstus} from "../../../../entity/drugbybrandandststus";
import {ReportService} from "../../../../reportservice";
import {Brandservice} from "../../../../../service/brandservice";
import {Genericservice} from "../../../../../service/genericservice";
import {Drugstatusservice} from "../../../../../service/drugstatusservice";
import {MatSnackBar} from "@angular/material/snack-bar";

declare var google: any;
@Component({
  selector: 'app-drugbybrandgenericstatus',
  templateUrl: './drugbybrandgenericstatus.component.html',
  styleUrls: ['./drugbybrandgenericstatus.component.css']
})
export class DrugbybrandgenericstatusComponent {
  @ViewChild('drugbarchart', { static: false }) drugbarchart: any;
  brands : Array<Brand>=[];
  generics:Array<Generic> =[];
  drugstatuses:Array<Drugstatus>=[];

  public form!: FormGroup;
  drugByBrandAndStatus!: DrugByBrandAndStstus[];
  displyby:string= "bar";

  constructor(
    private rs:ReportService,
    private fb:FormBuilder,
    private bs:Brandservice,
    private gs:Genericservice,
    private dss:Drugstatusservice,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      "brand": new FormControl(),
      "generic": new FormControl(),
      "drugstatus": new FormControl()
    });
  }
  ngOnInit() {

    this.initialize();
  }

  initialize(){
    this.bs.getAll().then((brnds: Brand[]) => {
      this.brands = brnds;
    });

    this.gs.getAll().then((gnrcs: Generic[]) => {
      this.generics = gnrcs;
    });

    this.dss.getAll().then((drugss: Drugstatus[]) => {
      this.drugstatuses = drugss;
    });
  }

  getChartData() {

    let chartValues = this.form.getRawValue();

    let brandId = chartValues.brand;
    let genericId = chartValues.generic;
    let statusId = chartValues.drugstatus;
    console.log(brandId, genericId, statusId);
    let query = "";

    if (brandId != null) query += "brandId=" + brandId + "&";
    if (genericId != null) query += "genericId=" + genericId + "&";
    if (statusId != null) query += "statusId=" + statusId + "&";

    if (query.endsWith("&")) query = query.slice(0, -1);

    if (query) query = "?" + query;

    console.log(query);
    this.generateChart(query);
    console.log(brandId, genericId, statusId);
  }


  generateChart(query: string) {
    this.rs.getdrugByBrandGenericStatsu(query).then((drugs: DrugByBrandAndStstus[]) => {
      this.drugByBrandAndStatus = drugs;
      this.loadCharts();
    }).catch((error) => {
      console.error('Error fetching drug data:', error);
      this.snackBar.open('Failed to fetch drug data. Please try again later.', 'Close', {
        duration: 1000,
      });
    });
  }


  loadCharts(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }

  drawCharts(): void {
    if (!this.drugByBrandAndStatus || this.drugByBrandAndStatus.length === 0) {
      this.snackBar.open('Failed to fetch drug data. Please try again later.', 'Close', {
        duration: 1000,
      });
      return;
    }

    // Drug Chart
    const drugbarData = new google.visualization.DataTable();
    drugbarData.addColumn('string', 'Brand');
    drugbarData.addColumn('number', 'Count');

    this.drugByBrandAndStatus.forEach((drug: DrugByBrandAndStstus) => {
      drugbarData.addRow([drug.brand, drug.count]);
    });


    // Drug
    const drugbarOptions = {
      title: 'Drug Count by Brand (Bar Chart)',
      subtitle: 'Count of Drugs by Brand',
      bars: 'horizontal',
      height: 400,
      width: 600
    };

    const drugbarChart = new google.visualization.ColumnChart(this.drugbarchart.nativeElement);
    drugbarChart.draw(drugbarData, drugbarOptions);
  }








  table() {
    this.displyby="table"
  }

  line() {
    this.displyby="line"
  }

  bar(){
    this.displyby="bar"

  }
  pie(){
    this.displyby="pie"

  }
}
