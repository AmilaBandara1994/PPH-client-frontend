import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthorizationManager} from "../../service/authorizationmanager";
import {DarkModeService} from "../../service/DarkModeService";


@Component({
  selector: 'app-mainwindow',
  templateUrl: './mainwindow.component.html',
  styleUrls: ['./mainwindow.component.css']
})
export class MainwindowComponent {

  opened: boolean = true;
  repGroup:any[] = [
    {name:"Count By Designation", routerLink:"reports/countbydesignation" },
    {name:"Count Clinic By Clinictype", routerLink:"reports/cliniccountbyclinictype"  }
  ];

  constructor(
    private router: Router,
    public authService: AuthorizationManager,
    public darkModeSevice:DarkModeService) {
  }


  logout(): void {
    this.router.navigateByUrl("login")
    this.authService.clearUsername();
    this.authService.clearButtonState();
    this.authService.clearMenuState();
    localStorage.removeItem("Authorization");
  }
    admMenuItems = this.authService.admMenuItems;
    regMenuItems = this.authService.regMenuItems;
    clinicMenuItems = this.authService.clinicMenuItems;
    doctorMenuItems = this.authService.docMenuItems;
    drugMenuItems = this.authService.drugMenuItems;
    diagnosisMenuItems = this.authService.diagnosisMenuItems;
    patientMenuItems = this.authService.patientMenuItems;
    prescriptionMenuItems = this.authService.prescriptionMenuItems;
    appointmentMenuItems = this.authService.appointmentMenuItems;
    investigationMenuItems = this.authService.investigationMenuItems;
    doctorPaymentMenuItems = this.authService.doctorPaymentMenuItems;
    familyMenuItems = this.authService.familyMenuItems;

  isMenuVisible(category: string): boolean {
    switch (category) {
      case 'Admin':
        return this.admMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Registration':
        return this.regMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Doctor':
        return this.doctorMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Clinic':
        return this.clinicMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Drug':
        return this.drugMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Diagnosis':
        return this.diagnosisMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Patient':
        return this.patientMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Prescription':
        return this.prescriptionMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Appointment':
        return this.appointmentMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Investigation':
        return this.investigationMenuItems.some(menuItem => menuItem.accessFlag);
      case 'DoctorPayment':
        return this.doctorPaymentMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Family':
        return this.familyMenuItems.some(menuItem => menuItem.accessFlag);

        default:
        return false;
    }
  }

}
