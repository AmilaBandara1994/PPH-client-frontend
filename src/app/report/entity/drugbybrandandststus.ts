export class DrugByBrandAndStstus {
  constructor(brand: string, status: string, count: number) {
    this.brand = brand;
    this.status = status;
    this.count = count;
  }

  public brand!: string;
  public status !: string;
  public count !: number;

}
