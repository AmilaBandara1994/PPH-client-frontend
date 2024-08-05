import {Component, OnInit, ViewChild} from '@angular/core';
import {ReportService} from "../../reportservice";
import {MatTableDataSource} from "@angular/material/table";
import {ClinicCountByClinictype} from "../../entity/cliniccountbyclinictype";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";

declare var google:any

@Component({
  selector: 'app-cliniccountbyclinictype',
  templateUrl: './cliniccountbyclinictype.component.html',
  styleUrls: ['./cliniccountbyclinictype.component.css']
})
export class CliniccountbyclinictypeComponent implements OnInit{
  selected = 'monthly';
  displyby:string= "table";
  public form!: FormGroup;

  clinicbyclinictype!: ClinicCountByClinictype[];
  data!: MatTableDataSource<ClinicCountByClinictype>;

  columns: string[] = ['clinicType', 'clinicCount', 'patientcount'];
  headers: string[] = ['Clinic-Type', 'Clinic-Count', 'Patient-Count'];
  binders: string[] = ['clinicType', 'clinicCount', 'patientCount'];

  @ViewChild('barchart', { static: false }) barchart: any;
  @ViewChild('piechart', { static: false }) piechart: any;
  @ViewChild('linechart', { static: false }) linechart: any;

  constructor(
    private rs: ReportService,
  private _location: Location,
  private arouter: ActivatedRoute,
  private fb: FormBuilder,
  ) {
    //Define Interactive Panel with Needed Form Elements


    this.form = this.fb.group({
      "time": new FormControl(),
    }, {updateOn: 'change'});

  }

  ngOnInit(): void {

    this.rs.cliniccountbyclinictype()
      .then((ccbc: ClinicCountByClinictype[]) => {
        this.clinicbyclinictype = ccbc;
      }).finally(() => {
      console.log(this.clinicbyclinictype)
      this.loadTable();
      this.loadCharts();
      this.getvalue()

    });

  }

  loadTable() : void{
    this.data = new MatTableDataSource(this.clinicbyclinictype);
  }

  loadCharts() : void{
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }


  drawCharts() {

    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'clinicType');
    barData.addColumn('number', 'clinicCount');
    barData.addColumn('number', 'patientCount');

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'clinicType');
    pieData.addColumn('number', 'clinicCount');
    pieData.addColumn('number', 'patientCount');

    const lineData = new google.visualization.DataTable();
    lineData.addColumn('string', 'clinicType');
    lineData.addColumn('number', 'clinicCount');
    lineData.addColumn('number', 'patientCount');

    this.clinicbyclinictype.forEach((clinic: ClinicCountByClinictype) => {
      barData.addRow([clinic.clinicType, clinic.clinicCount, clinic.patientCount]);
      pieData.addRow([clinic.clinicType, clinic.clinicCount, clinic.patientCount]);
      lineData.addRow([clinic.clinicType, clinic.clinicCount, clinic.patientCount]);
    });

    const barOptions = {
      title: 'Clinic Count (Bar Chart)',
      subtitle: 'Count of Clinic by Clinictype',
      bars: 'horizontal',
      height: 400,
      width: 600
    };

    const pieOptions = {
      title: 'Clinic Count (Pie Chart)',
      height: 400,
      width: 550
    };

    const lineOptions = {
      title: 'Clinic Count (Line Chart)',
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

  getvalue(){
    this.form.get('time')?.valueChanges.subscribe((value:string) =>{
      if(value == null )return;
      console.log(value);
    });
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
