import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {ReportService} from "../../../../reportservice";
import {Countbytreatmentplan} from "../../../../entity/countbytreatmentplan";
import {MatPaginator} from "@angular/material/paginator";

declare var google: any;
@Component({
  selector: 'app-count-by-treatmentplan',
  templateUrl: './count-by-treatmentplan.component.html',
  styleUrls: ['./count-by-treatmentplan.component.css']
})
export class CountByTreatmentplanComponent {

  selected = 'monthly';
  displyby:string= "table";
  public form!: FormGroup;

  countbytreatmentplan!: Countbytreatmentplan[];
  data!: MatTableDataSource<Countbytreatmentplan>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columns: string[] = ['treatmentplan', 'count', 'percentage'];
  headers: string[] = ['Treatment Plan', 'Count', 'Percentage'];
  binders: string[] = ['treatmentplan', 'count', 'percentage'];

  @ViewChild('barchart', { static: false }) barchart: any;
  @ViewChild('piechart', { static: false }) piechart: any;
  @ViewChild('linechart', { static: false }) linechart: any

  total!:number[];
  ftext:string = "Total Counts"

  constructor(
    private _location: Location,
    private arouter: ActivatedRoute,
    private fb: FormBuilder,
    private rs: ReportService
  ) {

    this.form = this.fb.group({
      "time": new FormControl(),
    }, {updateOn: 'change'});

  }

  ngOnInit(): void {
    this.rs.countbytreatmentplan()
      .then((ccbc: Countbytreatmentplan[]) => {
        console.log(ccbc)
        this.countbytreatmentplan = ccbc;
      }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });

  }

  getvalue(){
    this.form.get('time')?.valueChanges.subscribe((value:string) =>{
      if(value == null )return;
      console.log(value);
    });
  }

  loadTable() : void{
    this.data = new MatTableDataSource(this.countbytreatmentplan);
    this.data.paginator = this.paginator;
  }

  loadCharts() : void{
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }


  drawCharts() {

    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'Treatment Plan');
    barData.addColumn('number', 'Count');

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'Treatment Plan');
    pieData.addColumn('number', 'Count');

    const lineData = new google.visualization.DataTable();
    lineData.addColumn('string', 'Treatment Plan');
    lineData.addColumn('number', 'Count');

    this.countbytreatmentplan.forEach((des: Countbytreatmentplan) => {
      barData.addRow([des.treatmentplan, des.count]);
      pieData.addRow([des.treatmentplan, des.count]);
      lineData.addRow([des.treatmentplan, des.count]);
    });

    const barOptions = {
      title: 'Diagnosis Count   (Bar Chart)',
      subtitle: 'Count of Diagnosis By Treatment Plan',
      bars: 'horizontal',
      height: 400,
      width: 600
    };

    const pieOptions = {
      title: 'Diagnosis Count (Pie Chart)',
      height: 400,
      width: 550
    };

    const lineOptions = {
      title: 'Diagnosis Count (Line Chart)',
      height: 400,
      width: 600
    };

    const barChart = new google.visualization.BarChart(this.barchart.nativeElement);
    barChart.draw(barData, barOptions);

    const pieChart = new google.visualization.PieChart(this.piechart.nativeElement);
    pieChart.draw(pieData, pieOptions);

    const lineChart = new google.visualization.LineChart(this.linechart.nativeElement);
    lineChart.draw(lineData, lineOptions);
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


