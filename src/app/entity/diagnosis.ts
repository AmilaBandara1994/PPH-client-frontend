
import {Employee} from "./employee";
import {Appointment} from "./appointment";
import {Severity} from "./severity";
import {Treatmentplan} from "./treatmentplan";
import {Diagnosisstatus} from "./diagnosisstatus";
import {Diseasediagnosis} from "./diseasediagnosis";
import {Symptomsdiagnosis} from "./symptomsdiagnosis";
import {Allergydiagnosis} from "./allergydiagnosis";
import {Doctordegree} from "./doctordegree";
import {Investigation} from "./investigation";

export class Diagnosis {

  private _id !: number;
  private _appointment !: Appointment;
  private _onsetduration !: string;
  private _disease !: string;
  private _severity !: Severity;
  private _bloodpresure !: string;
  private _heartrate !: string;
  private _temperature !: string;
  private _description !: string;
  private _respiratoryrate !: number;
  private _height !: string;
  private _weight !: string;
  private _examination !: string;
  private _allergy !: string;
  private _medicalhistory !: string;
  private _surgicalhistory !: string;
  private _doctornote !: string;
  private _time !: Date;
  private _treatmentplan !: Treatmentplan;
  private _employee !: Employee;
  private _diagnosisstatus !: Diagnosisstatus;

  private _diseasediagnoses!:Array<Diseasediagnosis>;
  private _symptomsdiagnoses!:Array<Symptomsdiagnosis>;
  private _allergydiagnoses!:Array<Allergydiagnosis>;


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get appointment(): Appointment {
    return this._appointment;
  }

  set appointment(value: Appointment) {
    this._appointment = value;
  }

  get onsetduration(): string {
    return this._onsetduration;
  }

  set onsetduration(value: string) {
    this._onsetduration = value;
  }

  get disease(): string {
    return this._disease;
  }

  set disease(value: string) {
    this._disease = value;
  }

  get severity(): Severity {
    return this._severity;
  }

  set severity(value: Severity) {
    this._severity = value;
  }

  get bloodpresure(): string {
    return this._bloodpresure;
  }

  set bloodpresure(value: string) {
    this._bloodpresure = value;
  }

  get heartrate(): string {
    return this._heartrate;
  }

  set heartrate(value: string) {
    this._heartrate = value;
  }

  get temperature(): string {
    return this._temperature;
  }

  set temperature(value: string) {
    this._temperature = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get respiratoryrate(): number {
    return this._respiratoryrate;
  }

  set respiratoryrate(value: number) {
    this._respiratoryrate = value;
  }

  get height(): string {
    return this._height;
  }

  set height(value: string) {
    this._height = value;
  }

  get weight(): string {
    return this._weight;
  }

  set weight(value: string) {
    this._weight = value;
  }

  get examination(): string {
    return this._examination;
  }

  set examination(value: string) {
    this._examination = value;
  }

  get allergy(): string {
    return this._allergy;
  }

  set allergy(value: string) {
    this._allergy = value;
  }

  get medicalhistory(): string {
    return this._medicalhistory;
  }

  set medicalhistory(value: string) {
    this._medicalhistory = value;
  }

  get surgicalhistory(): string {
    return this._surgicalhistory;
  }

  set surgicalhistory(value: string) {
    this._surgicalhistory = value;
  }

  get doctornote(): string {
    return this._doctornote;
  }

  set doctornote(value: string) {
    this._doctornote = value;
  }

  get time(): Date {
    return this._time;
  }

  set time(value: Date) {
    this._time = value;
  }

  get treatmentplan(): Treatmentplan {
    return this._treatmentplan;
  }

  set treatmentplan(value: Treatmentplan) {
    this._treatmentplan = value;
  }

  get employee(): Employee {
    return this._employee;
  }

  set employee(value: Employee) {
    this._employee = value;
  }

  get diagnosisstatus(): Diagnosisstatus {
    return this._diagnosisstatus;
  }

  set diagnosisstatus(value: Diagnosisstatus) {
    this._diagnosisstatus = value;
  }

  get diseasediagnoses(): Array<Diseasediagnosis> {
    return this._diseasediagnoses;
  }

  set diseasediagnoses(value: Array<Diseasediagnosis>) {
    this._diseasediagnoses = value;
  }

  get symptomsdiagnoses(): Array<Symptomsdiagnosis> {
    return this._symptomsdiagnoses;
  }

  set symptomsdiagnoses(value: Array<Symptomsdiagnosis>) {
    this._symptomsdiagnoses = value;
  }

  get allergydiagnoses(): Array<Allergydiagnosis> {
    return this._allergydiagnoses;
  }

  set allergydiagnoses(value: Array<Allergydiagnosis>) {
    this._allergydiagnoses = value;
  }


  constructor(id: number, appointment: Appointment, onsetduration: string, disease: string, severity: Severity, bloodpresure: string, heartrate: string, temperature: string, description: string, respiratoryrate: number, height: string, weight: string, examination: string, allergy: string, medicalhistory: string, surgicalhistory: string, doctornote: string, time: Date, treatmentplan: Treatmentplan, employee: Employee, diagnosisstatus: Diagnosisstatus, diseasediagnoses: Array<Diseasediagnosis>, symptomsdiagnoses: Array<Symptomsdiagnosis>, allergydiagnoses: Array<Allergydiagnosis>) {
    this._id = id;
    this._appointment = appointment;
    this._onsetduration = onsetduration;
    this._disease = disease;
    this._severity = severity;
    this._bloodpresure = bloodpresure;
    this._heartrate = heartrate;
    this._temperature = temperature;
    this._description = description;
    this._respiratoryrate = respiratoryrate;
    this._height = height;
    this._weight = weight;
    this._examination = examination;
    this._allergy = allergy;
    this._medicalhistory = medicalhistory;
    this._surgicalhistory = surgicalhistory;
    this._doctornote = doctornote;
    this._time = time;
    this._treatmentplan = treatmentplan;
    this._employee = employee;
    this._diagnosisstatus = diagnosisstatus;
    this._diseasediagnoses = diseasediagnoses;
    this._symptomsdiagnoses = symptomsdiagnoses;
    this._allergydiagnoses = allergydiagnoses;
  }
}
