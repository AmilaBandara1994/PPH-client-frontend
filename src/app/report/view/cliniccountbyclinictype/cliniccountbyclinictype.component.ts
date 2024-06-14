import {Component, OnInit, ViewChild} from '@angular/core';
import {ReportService} from "../../reportservice";
import {MatTableDataSource} from "@angular/material/table";
import {ClinicCountByClinictype} from "../../entity/cliniccountbyclinictype";

declare var google:any

@Component({
  selector: 'app-cliniccountbyclinictype',
  templateUrl: './cliniccountbyclinictype.component.html',
  styleUrls: ['./cliniccountbyclinictype.component.css']
})
export class CliniccountbyclinictypeComponent implements OnInit{

  clinicbyclinictype!: ClinicCountByClinictype[];
  data!: MatTableDataSource<ClinicCountByClinictype>;

  columns: string[] = ['clinicType', 'clinicCount', 'patientcount'];
  headers: string[] = ['Clinic-Type', 'Clinic-Count', 'Patient-Count'];
  binders: string[] = ['clinicType', 'clinicCount', 'patientCount'];

  @ViewChild('barchart', { static: false }) barchart: any;
  @ViewChild('piechart', { static: false }) piechart: any;
  @ViewChild('linechart', { static: false }) linechart: any;

  constructor(private rs: ReportService) {
    //Define Interactive Panel with Needed Form Elements
  }

  ngOnInit(): void {

    this.rs.cliniccountbyclinictype()
      .then((ccbc: ClinicCountByClinictype[]) => {
        this.clinicbyclinictype = ccbc;
      }).finally(() => {
      console.log(this.clinicbyclinictype)
      this.loadTable();
      this.loadCharts();
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

    // const pieData = new google.visualization.DataTable();
    // pieData.addColumn('string', 'Designation');
    // pieData.addColumn('number', 'Count');
    //
    // const lineData = new google.visualization.DataTable();
    // lineData.addColumn('string', 'Designation');
    // lineData.addColumn('number', 'Count');

    this.clinicbyclinictype.forEach((clinic: ClinicCountByClinictype) => {
      barData.addRow([clinic.clinicType, clinic.clinicCount, clinic.patientCount]);
      // pieData.addRow([des.clinictype, des.cliniccount, des.patientcount]);
      // lineData.addRow([des.clinictype, des.cliniccount, des.patientcount]);
    });

    const barOptions = {
      title: 'Clinic Count (Bar Chart)',
      subtitle: 'Count of Clinic by Clinictype',
      bars: 'horizontal',
      height: 400,
      width: 600
    };

    // const pieOptions = {
    //   title: 'Designation Count (Pie Chart)',
    //   height: 400,
    //   width: 550
    // };
    //
    // const lineOptions = {
    //   title: 'Designation Count (Line Chart)',
    //   height: 400,
    //   width: 600
    // };

    const barChart = new google.visualization.BarChart(this.barchart.nativeElement);
    barChart.draw(barData, barOptions);

    // const pieChart = new google.visualization.PieChart(this.piechart.nativeElement);
    // pieChart.draw(pieData, pieOptions);
    //
    // const lineChart = new google.visualization.LineChart(this.linechart.nativeElement);
    // lineChart.draw(lineData, lineOptions);
  }



}
