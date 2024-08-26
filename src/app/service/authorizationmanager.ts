import { Injectable } from '@angular/core';
import { AuthoritySevice } from './authoritysevice';

@Injectable()
export class AuthorizationManager {

  private readonly localStorageUsreName = 'username';
  private readonly localStorageButtonKey = 'buttonState';
  private readonly localStorageAdmMenus = 'admMenuState';
  private readonly localStorageRegMenus = 'regMenuState';
  private readonly localStorageClinicMenus = 'clinicMenuState';
  private readonly localStorageDoctorMenus = 'doctorMenuState';
  private readonly localStorageDrugMenus = 'drugMenuState';
  private readonly localStorageDiagnosisMenus = 'diagnosisMenuState';
  private readonly localStoragePatientMenus = 'patientMenuState';
  private readonly localStorageFamilyMenus = 'familyMenuState';
  private readonly localStoragePrescriptionMenus = 'prescriptionMenuState';
  private readonly localStorageAppointmentMenus = 'appointmentMenuState';
  private readonly localStorageInvestigationMenus = 'investigationMenuState';
  private readonly localStorageDoctorPaymentMenus = 'doctorPaymentMenuState';
  private readonly localStoragePatientPaymentMenus = 'PatientPaymentMenuState';

  public enaadd = false;
  public enaupd = false;
  public enadel = false;

  admMenuItems = [
    { name: 'Employee', accessFlag: true, routerLink: 'employee' },
    { name: 'User', accessFlag: true, routerLink: 'user' },
    { name: 'Privilege', accessFlag: true, routerLink: 'privilege' },
    { name: 'Operations', accessFlag: true, routerLink: 'operation' }
  ];
  clinicMenuItems = [
    { name: 'Clinic', accessFlag: true, routerLink: 'clinics' }
  ];

  regMenuItems = [
    { name: 'Student', accessFlag: true, routerLink: 'students' },
    { name: 'Batch Registration', accessFlag: true, routerLink: 'batchregistration' },
    { name: 'Payments', accessFlag: true, routerLink: 'payments' },
    { name: 'Mat. Distribution', accessFlag: true, routerLink: 'matdistribution' }
  ];
 docMenuItems = [
    { name: 'Doctor', accessFlag: true, routerLink: 'doctor' },
  ];
  drugMenuItems = [
    { name: 'Drug', accessFlag: true, routerLink: 'drug' },
  ];
  diagnosisMenuItems = [
    { name: 'Diagnosis', accessFlag: true, routerLink: 'diagnosis' },
  ];
  patientMenuItems = [
    { name: 'Patient', accessFlag: true, routerLink: 'patient' },
  ];
  prescriptionMenuItems = [
    { name: 'Prescription', accessFlag: true, routerLink: 'prescription' },
  ];
  appointmentMenuItems = [
    { name: 'Appointment', accessFlag: true, routerLink: 'appointment' },
  ];
  familyMenuItems = [
    { name: 'Family', accessFlag: true, routerLink: 'family' },
  ];
  doctorPaymentMenuItems = [
    { name: 'DoctorPayment', accessFlag: true, routerLink: 'doctorpayment' },
  ];
  investigationMenuItems = [
    { name: 'Investigation', accessFlag: true, routerLink: 'investigation' },
  ];
  patientPaymentMenuItems = [
    { name: 'PatientPayment', accessFlag: true, routerLink: 'patientpayment' },
  ];

  constructor(private am: AuthoritySevice) {}

  enableButtons(authorities: { module: string; operation: string }[]): void {
    this.enaadd = authorities.some(authority => authority.operation === 'insert');
    this.enaupd = authorities.some(authority => authority.operation === 'update');
    this.enadel = authorities.some(authority => authority.operation === 'delete');

    // Save button state in localStorage
    localStorage.setItem(this.localStorageButtonKey, JSON.stringify({ enaadd: this.enaadd, enaupd: this.enaupd, enadel: this.enadel }));
  }

  enableMenues(modules: { module: string; operation: string }[]): void {
    this.admMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.clinicMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.regMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.docMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });
    this.drugMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });
    this.diagnosisMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });
    this.patientMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.prescriptionMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });
    this.appointmentMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });
    this.familyMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });
    this.investigationMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });
    this.doctorPaymentMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });
    this.patientPaymentMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });


    // Save menu state in localStorage
    localStorage.setItem(this.localStorageAdmMenus, JSON.stringify(this.admMenuItems));
    localStorage.setItem(this.localStorageRegMenus, JSON.stringify(this.regMenuItems));
    localStorage.setItem(this.localStorageClinicMenus, JSON.stringify(this.clinicMenuItems));
    localStorage.setItem(this.localStorageDoctorMenus, JSON.stringify(this.docMenuItems));
    localStorage.setItem(this.localStorageDrugMenus, JSON.stringify(this.drugMenuItems));
    localStorage.setItem(this.localStorageDiagnosisMenus, JSON.stringify(this.diagnosisMenuItems));
    localStorage.setItem(this.localStoragePatientMenus, JSON.stringify(this.patientMenuItems));
    localStorage.setItem(this.localStoragePrescriptionMenus, JSON.stringify(this.prescriptionMenuItems));
    localStorage.setItem(this.localStorageAppointmentMenus, JSON.stringify(this.appointmentMenuItems));
    localStorage.setItem(this.localStorageFamilyMenus, JSON.stringify(this.familyMenuItems));
    localStorage.setItem(this.localStorageInvestigationMenus, JSON.stringify(this.investigationMenuItems));
    localStorage.setItem(this.localStorageDoctorPaymentMenus, JSON.stringify(this.doctorPaymentMenuItems));
    localStorage.setItem(this.localStoragePatientPaymentMenus, JSON.stringify(this.patientPaymentMenuItems));

  }


  async getAuth(username: string): Promise<void> {

    this.setUsername(username);

    try {
      const result = await this.am.getAutorities(username);
      if (result !== undefined) {
        const authorities = result.map(authority => {
          const [module, operation] = authority.split('-');
          return { module, operation };
        });
        console.log(authorities);

        this.enableButtons(authorities);
        this.enableMenues(authorities);

      } else {
        console.log('Authorities are undefined');
      }
    } catch (error) {
      console.error(error);
    }
  }

  getUsername(): string {
    return localStorage.getItem(this.localStorageUsreName) || '';
  }

  setUsername(value: string): void {
    localStorage.setItem(this.localStorageUsreName, value);
  }

  getEnaAdd(): boolean {
    return this.enaadd;
  }

  getEnaUpd(): boolean {
    return this.enaupd;
  }

  getEnaDel(): boolean {
    return this.enadel;
  }

  initializeButtonState(): void {
    const buttonState = localStorage.getItem(this.localStorageButtonKey);
    if (buttonState) {
      const { enaadd, enaupd, enadel } = JSON.parse(buttonState);
      this.enaadd = enaadd;
      this.enaupd = enaupd;
      this.enadel = enadel;
    }
  }

  initializeMenuState(): void {
    const admMenuState = localStorage.getItem(this.localStorageAdmMenus);
    if (admMenuState) {
      this.admMenuItems = JSON.parse(admMenuState);
    }
    const clinicMenuState = localStorage.getItem(this.localStorageClinicMenus);
    if (clinicMenuState) {
      this.clinicMenuItems = JSON.parse(clinicMenuState);
    }
    const regMenuState = localStorage.getItem(this.localStorageRegMenus);
    if (regMenuState) {
      this.regMenuItems = JSON.parse(regMenuState);
    }
    const docMenuState = localStorage.getItem(this.localStorageDoctorMenus);
    if (docMenuState) {
      this.docMenuItems = JSON.parse(docMenuState);
    }
    const drugMenuState = localStorage.getItem(this.localStorageDrugMenus);
    if (drugMenuState) {
      this.drugMenuItems = JSON.parse(drugMenuState);
    }
    const diagnosisMenuState = localStorage.getItem(this.localStorageDiagnosisMenus);
    if (diagnosisMenuState) {
      this.diagnosisMenuItems = JSON.parse(diagnosisMenuState);
    }
    const patientMenuState = localStorage.getItem(this.localStoragePatientMenus);
    if (patientMenuState) {
      this.patientMenuItems = JSON.parse(patientMenuState);
    }
    const prescriptionMenuState = localStorage.getItem(this.localStoragePrescriptionMenus);
    if (prescriptionMenuState) {
      this.prescriptionMenuItems = JSON.parse(prescriptionMenuState);
    }

    const appointmentMenuState = localStorage.getItem(this.localStorageAppointmentMenus);
    if (appointmentMenuState) {
      this.appointmentMenuItems = JSON.parse(appointmentMenuState);
    }
    const familyMenuState = localStorage.getItem(this.localStorageFamilyMenus);
    if (familyMenuState) {
      this.familyMenuItems = JSON.parse(familyMenuState);
    }
    const investigationMenuState = localStorage.getItem(this.localStorageInvestigationMenus);
    if (investigationMenuState) {
      this.investigationMenuItems = JSON.parse(investigationMenuState);
    }

    const doctorPaymentMenuState = localStorage.getItem(this.localStorageDoctorPaymentMenus);
    if (doctorPaymentMenuState) {
      this.doctorPaymentMenuItems = JSON.parse(doctorPaymentMenuState);
    }

  }

  clearUsername(): void {
    localStorage.removeItem(this.localStorageUsreName);
  }

  clearButtonState(): void {
    localStorage.removeItem(this.localStorageButtonKey);
  }

  clearMenuState(): void {
    localStorage.removeItem(this.localStorageAdmMenus);
    localStorage.removeItem(this.localStorageRegMenus);
    localStorage.removeItem(this.localStorageClinicMenus);
    localStorage.removeItem(this.localStorageDoctorMenus);
    localStorage.removeItem(this.localStorageDrugMenus);
    localStorage.removeItem(this.localStorageDiagnosisMenus);
    localStorage.removeItem(this.localStoragePatientMenus);
    localStorage.removeItem(this.localStoragePrescriptionMenus);
    localStorage.removeItem(this.localStorageAppointmentMenus);
    localStorage.removeItem(this.localStorageFamilyMenus);
    localStorage.removeItem(this.localStorageDoctorPaymentMenus);
  }

  isMenuItemDisabled(menuItem: { accessFlag: boolean }): boolean {
    return !menuItem.accessFlag;
  }

}
