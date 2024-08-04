
import {Employee} from "./employee";
import {Appointment} from "./appointment";
import {Severity} from "./severity";
import {Treatmentplan} from "./treatmentplan";
import {Diagnosisstatus} from "./diagnosisstatus";
import {Diseasediagnosis} from "./diseasediagnosis";
import {Symptomsdiagnosis} from "./symptomsdiagnosis";
import {Allergydiagnosis} from "./allergydiagnosis";

export class Diagnosis {

  public id !: number;
  public appointment !: Appointment;
  public onsetduration !: string;
  public disease !: string;
  public bplevel !: string;
  public severity !: Severity;
  public bloodpresure !: string;
  public heartrate !: string;
  public temperature !: string;
  public description !: string;
  public respiratoryrate !: number;
  public height !: string;
  public weight !: string;
  public examination !: string;
  public allergy !: string;
  public medicalhistory !: string;
  public surgicalhistory !: string;
  public doctornote !: string;
  public time !: Date;
  public drugstatus !: Treatmentplan;
  public employee !: Employee;
  public diagnosisstatus !: Diagnosisstatus;

  public diseasediagnoses!:Array<Diseasediagnosis>;
  public symptomsdiagnoses!:Array<Symptomsdiagnosis>;
  public allergydiagnoses!:Array<Allergydiagnosis>;

  constructor() {
  }

  // constructor(id: number, appointment: Appointment, onsetduration: string, disease: string, bplevel: string, severity: Severity, bloodpresure: string, heartrate: string, temperature: string, description: string, respiratoryrate: number, height: string, weight: string, examination: string, allergy: string, medicalhistory: string, surgicalhistory: string, doctornote: string, time: Date, drugstatus: Treatmentplan, employee: Employee, diagnosisstatus: Diagnosisstatus, diseasediagnoses: Array<Diseasediagnosis>, symptomsdiagnoses: Array<Symptomsdiagnosis>, allergydiagnoses: Array<Allergydiagnosis>) {
  //   this.id = id;
  //   this.appointment = appointment;
  //   this.onsetduration = onsetduration;
  //   this.disease = disease;
  //   this.bplevel = bplevel;
  //   this.severity = severity;
  //   this.bloodpresure = bloodpresure;
  //   this.heartrate = heartrate;
  //   this.temperature = temperature;
  //   this.description = description;
  //   this.respiratoryrate = respiratoryrate;
  //   this.height = height;
  //   this.weight = weight;
  //   this.examination = examination;
  //   this.allergy = allergy;
  //   this.medicalhistory = medicalhistory;
  //   this.surgicalhistory = surgicalhistory;
  //   this.doctornote = doctornote;
  //   this.time = time;
  //   this.drugstatus = drugstatus;
  //   this.employee = employee;
  //   this.diagnosisstatus = diagnosisstatus;
  //   this.diseasediagnoses = diseasediagnoses;
  //   this.allergydiagnoses = allergydiagnoses;
  //   this.symptomsdiagnoses = symptomsdiagnoses;
  // }
}
