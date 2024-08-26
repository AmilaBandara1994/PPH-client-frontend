import {Component, ViewChild} from '@angular/core';

@Component({
  selector: 'app-clinic',
  templateUrl: './clinic.component.html',
  styleUrls: ['./clinic.component.css']
})
export class ClinicComponent {
  ngOnInit() {
    window.scrollTo(0, 0);
  }
}
