import {Prescription} from "./prescription";
import {Drug} from "./drug";
import {Drugschedule} from "./drugschedule";
import {Meal} from "./meal";
import {Dosage} from "./dosage";

export class Prescriptiondrug {

  public id !: number;
  public drug !: Drug;
  public drugschedule !: Drugschedule;
  public dosage !: Dosage;
  public meal !: Meal;
  public dose !: string;
  public description !: string;
  public days !: string;


  constructor(drug: Drug, drugschedule: Drugschedule, dosage: Dosage, meal: Meal, dose: string, description: string, days: string) {
    this.drug = drug;
    this.drugschedule = drugschedule;
    this.dosage = dosage;
    this.meal = meal;
    this.dose = dose;
    this.description = description;
    this.days = days;
  }
}
