import {Component, Input, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Employee} from "../../../../entity/employee";
import {Subscription} from "rxjs";
import {EmployeeService} from "../../../../service/employeeservice";
import {DatePipe, Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {RegexService} from "../../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {Drug} from "../../../../entity/drug";
import {Drugform} from "../../../../entity/drugform";
import {Generic} from "../../../../entity/generic";
import {Drugroute} from "../../../../entity/drugroute";
import {Drugstatus} from "../../../../entity/drugstatus";
import {Brand} from "../../../../entity/brand";
import {Indication} from "../../../../entity/indication";
import {Drugadverseeffect} from "../../../../entity/drugadverseeffect";
import {Drugcontraindication} from "../../../../entity/drugcontraindication";
import {Drugformservice} from "../../../../service/drugformservice";
import {Genericservice} from "../../../../service/genericservice";
import {Drugrouteservice} from "../../../../service/drugrouteservice";
import {Drugstatusservice} from "../../../../service/drugstatusservice";
import {Brandservice} from "../../../../service/brandservice";
import {Indicationservice} from "../../../../service/indicationservice";
import {Drugservice} from "../../../../service/drugservice";
import {MatSelectionList} from "@angular/material/list";
import {Drugindication} from "../../../../entity/drugindication";
import {Adverseeffect} from "../../../../entity/adverseeffect";
import {Contraindication} from "../../../../entity/contraindication";
import {Adverseeffectservice} from "../../../../service/adverseeffect.service";
import {Contraindicationservice} from "../../../../service/contraindicationservice";

@Component({
  selector: 'app-drug-form',
  templateUrl: './drug-form.component.html',
  styleUrls: ['./drug-form.component.css']
})
export class DrugFormComponent {

  imagedrugpurl: string = 'assets/my-img/banner/drugs.jpg'

  title: string = "Drug"
  public form!: FormGroup;
  updateForm: boolean = false;
  id!: number;

  newDrug!: Drug;
  oldDrug!: Drug;

  employees: Array<Employee> = [];
  drugforms: Array<Drugform> = [];
  generics: Array<Generic> = [];
  drugroutes: Array<Drugroute> = [];
  drugstatuses: Array<Drugstatus> = [];
  brands: Array<Brand> = [];

  drugindications: Array<Drugindication> = [];
  drugadverseeffects: Array<Drugadverseeffect> = [];
  drugcontraindications: Array<Drugcontraindication> = [];

  code!: string;
  name!: string;

  schedulesub!: Subscription;

  regexes: any;

  @Input() adverseeffects: Array<Adverseeffect> = [];
  oldadverseeffects: Array<Adverseeffect> = [];

  @Input() indications: Array<Indication> = [];
  oldindication: Array<Indication> = [];

  @Input() contraindications: Array<Contraindication> = [];
  oldcontraindications: Array<Contraindication> = [];

  @ViewChild('availablelist1') availablelist1!: MatSelectionList;
  @ViewChild('selectedlist1') selectedlist1!: MatSelectionList;

  @ViewChild('availablelist2') availablelist2!: MatSelectionList;
  @ViewChild('selectedlist2') selectedlist2!: MatSelectionList;

  @ViewChild('availablelist3') availablelist3!: MatSelectionList;
  @ViewChild('selectedlist3') selectedlist3!: MatSelectionList;

  constructor(
    private dformS: Drugformservice,
    private genericS: Genericservice,
    private drouteS: Drugrouteservice,
    private dstatusS: Drugstatusservice,
    private brandS: Brandservice,
    private indicationservice: Indicationservice,
    private adverseeffectservice:Adverseeffectservice ,
    private contraindicationservice: Contraindicationservice,

    private empS: EmployeeService,
    private drugS: Drugservice,
    private _location: Location,
    private arouter: ActivatedRoute,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService: AuthorizationManager) {




    this.form = this.fb.group({
      "drugform": new FormControl('', [Validators.required]),
      "generic": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
      "drugroute": new FormControl('', [Validators.required]),
      "drugstatus": new FormControl('', [Validators.required]),
      "brand": new FormControl('', [Validators.required]),

      "drugindication": new FormControl(),
      "drugadverseeffect": new FormControl(),
      "drugcontaraindication": new FormControl(),

      "photo": new FormControl(),
      "description": new FormControl('', [Validators.required]),
      "strength": new FormControl('', [Validators.required]),
      "qoh": new FormControl('', [Validators.required]),
      "rop": new FormControl('', [Validators.required]),
      "sprice": new FormControl('', [Validators.required]),
      "pprice": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});


  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.initialize();

    this.id = this.arouter.snapshot.params['id'];
    if(this.arouter.snapshot.params['id']){
      // @ts-ignore
      this.drugS.get(this.id).then((drug: Drug) => {
        this.oldDrug = drug;
        this.newDrug = drug;
        this.updateForm  = true;
        console.log(drug);
        console.log(this.newDrug);
        this.fillForm();

      });
    }



  }

  initialize() {

    this.empS.getAll('').then((emp: Employee[]) => {
      this.employees = emp;
    });
    this.dformS.getAll().then((drugforms: Drugform[]) => {
      this.drugforms = drugforms;
    });
    this.genericS.getAll().then((generics: Generic[]) => {
      this.generics = generics;
    });
    this.drouteS.getAll().then((drugroutes: Drugroute[]) => {
      this.drugroutes = drugroutes;
    })
    this.dstatusS.getAll().then((drugstatuses: Drugstatus[]) => {
      this.drugstatuses = drugstatuses;
    })

    this.brandS.getAll().then((brands: Brand[]) => {
      this.brands = brands;
    });
    this.indicationservice.getAll().then((indications: Indication[]) => {
      this.indications = indications;
    });
    this.adverseeffectservice.getAll().then((adverseeffects: Adverseeffect[]) => {
      this.adverseeffects = adverseeffects;
    })
    this.contraindicationservice.getAll().then((contraindications: Contraindication[]) => {
      this.contraindications = contraindications;
    })


    this.rs.get('drugs').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });

    // this.getscheduledclinic();
    // this.getcountbyclinic();
  }

  generateName(brand: string, generic: string, strength: string) {
    return brand + "-(" + generic + ")-" + strength;
  }

  generateCode(brand: Brand, generic: string) {
    let str = generic.slice(0, 2).toUpperCase();
    let str2 = brand.name.slice(0, 2).toUpperCase();
    return str + '-' + str2+ '-'+ this.dp.transform( new Date, 'yyMMddhhmm');
  }

  fillForm() {
    if (this.newDrug != undefined) {
      console.log(this.newDrug);
      if (this.newDrug.photo != null) {
        this.imagedrugpurl = atob(this.newDrug.photo);
        this.form.controls['photo'].clearValidators();
      } else {
        this.clearImage();
      }
      this.newDrug.photo = "";
      this.drugadverseeffects = this.newDrug.drugadverseeffects;
      this.drugindications = this.newDrug.drugindications;
      this.drugcontraindications = this.newDrug.drugcontraindications

      //@ts-ignore
      this.newDrug.drugroute = this.drugroutes.find(a => a.id === this.newDrug.drugroute.id);

      //@ts-ignore
      this.newDrug.generic = this.generics.find(a => a.id === this.newDrug.generic.id);
      console.log(this.newDrug.generic);
      //@ts-ignore
      this.newDrug.brand = this.brands.find(a => a.id === this.newDrug.brand.id);
      console.log(this.newDrug.brand);
      //@ts-ignore
      this.newDrug.drugform = this.drugforms.find(p => p.id === this.newDrug.drugform.id);
      //@ts-ignore
      this.newDrug.employee = this.employees.find(e => e.id === this.newDrug.employee.id);
      //@ts-ignore
      this.newDrug.drugstatus = this.drugstatuses.find(a => a.id === this.newDrug.drugstatus.id);

      this.form.patchValue(this.newDrug);
      this.form.markAsPristine();
    }

  }


  createForm() {

    this.form.controls['drugform'].setValidators([Validators.required]);
    this.form.controls['generic'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['drugroute'].setValidators([Validators.required]);
    this.form.controls['drugstatus'].setValidators([Validators.required]);
    this.form.controls['brand'].setValidators([Validators.required]);
    this.form.controls['drugindication'].setValidators([]);
    this.form.controls['drugadverseeffect'].setValidators([]);
    this.form.controls['drugcontaraindication'].setValidators([]);
    this.form.controls['description'].setValidators([Validators.required]);
    this.form.controls['strength'].setValidators([Validators.required]);
    this.form.controls['qoh'].setValidators([Validators.required]);
    this.form.controls['rop'].setValidators([Validators.required]);
    this.form.controls['sprice'].setValidators([Validators.required]);
    this.form.controls['pprice'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "dobirth" || controlName == "doassignment")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldDrug != undefined && control.valid) {
            // @ts-ignore
            if (value === this.employee[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }

    // this.enableButtons(true,false,false);

  }


  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - " + this.title + " Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {
      this.newDrug = this.form.getRawValue()
      this.newDrug.name = this.generateName(this.newDrug.brand.name, this.newDrug.generic.name, this.newDrug.strength.toString());
      this.newDrug.code = this.generateCode(this.newDrug.brand, this.newDrug.generic.name);

      this.newDrug.photo = btoa(this.imagedrugpurl);


      this.newDrug.drugadverseeffects = this.drugadverseeffects;
      this.newDrug.drugindications = this.drugindications;
      this.newDrug.drugcontraindications = this.drugcontraindications;

      let formdata: string = "";

      formdata = formdata + "<br>  Drug Code  is  : " + this.newDrug.code;
      formdata = formdata + "<br> Drug Name is : " + this.newDrug.name;
      formdata = formdata + "<br> Description is : " + this.newDrug.description;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - " + this.title + " Add",
          message: "Are you sure to Add the following " + this.title + " Data ? <br> <br>" + formdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          console.log('this  is drug ', this.newDrug)
          this.drugS.add(this.newDrug).then((responce: [] | undefined) => {
            if (responce != undefined) { // @ts-ignore
              console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              // @ts-ignore
              addstatus = responce['errors'] == "";
              console.log("Add Sta-" + addstatus);
              if (!addstatus) { // @ts-ignore
                addmessage = responce['errors'];
              }
            } else {
              console.log("undefined");
              addstatus = false;
              addmessage = "Content Not Found"
            }
          }).finally(() => {

            if (addstatus) {
              this.adleftAll();
              this.inleftAll();
              this.conleftAll();
              addmessage = "Successfully Saved";
              this.form.reset();
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status - " + this.title + " Add", message: addmessage}
            });

            stsmsg.afterClosed().subscribe(async result => {
              if (!result) {
                return;
              }
            });
          });
        }
      });
    }
  }


  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) {

        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }

    return errors;
  }




  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    return updates;
  }


  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - " + this.title + " Update ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - " + this.title + " Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("EmployeeService.update()");
            this.newDrug = this.form.getRawValue();
            if (this.form.controls['photo'].dirty) this.newDrug.photo = btoa(this.imagedrugpurl);
            this.newDrug.photo = this.oldDrug.photo;
            this.newDrug.id = this.oldDrug.id;


            //set name and code
            this.newDrug.name = this.generateName(this.newDrug.brand.name, this.newDrug.generic.name, this.newDrug.strength.toString());
            this.newDrug.code = this.generateCode(this.newDrug.brand, this.newDrug.generic.name);

            this.newDrug.drugadverseeffects = this.drugadverseeffects;
            this.newDrug.drugindications = this.drugindications;
            this.newDrug.drugcontraindications = this.drugcontraindications;


            console.log(this.newDrug)
            this.drugS.update(this.newDrug).then((responce: [] | undefined) => {
              if (responce != undefined) { // @ts-ignore
                //console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
                // @ts-ignore
                updstatus = responce['errors'] == "";
                //console.log("Upd Sta-" + updstatus);
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                //console.log("undefined");
                updstatus = false;
                updmessage = "Content Not Found"
              }
            }).finally(() => {
              if (updstatus) {
                this.adleftAll();
                this.inleftAll();
                this.conleftAll();
                updmessage = "Successfully Updated";
                this.form.reset();
                // this.clearImage();
                Object.values(this.form.controls).forEach(control => {
                  control.markAsTouched();
                });
                // this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status " + this.title + " Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => {
                if (!result) {
                  return;
                }
              });

            });
          }
        });
      } else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - " + this.title + " Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => {
          if (!result) {
            return;
          }
        });

      }
    }


  }


  selectImage(e: any): void {
    if (e.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.imagedrugpurl = event.target.result;
        this.form.controls['photo'].clearValidators();
      }
    }
  }

  clearImage(): void {
    this.imagedrugpurl = 'assets/default.png';
    this.form.controls['photo'].setErrors({'required': true});
  }

  adrightSelected(): void {
    this.newDrug.drugadverseeffects = this.availablelist1.selectedOptions.selected.map(option => {
      const drugadverseeffect = new Drugadverseeffect(option.value);
      this.adverseeffects = this.adverseeffects.filter(ad => ad !== option.value); //Remove Selected
      this.drugadverseeffects.push(drugadverseeffect); // Add selected to Right Side
      // this.a drugadverseeffect;
      return drugadverseeffect;
    });

    this.form.controls["drugadverseeffect"].clearValidators();
    this.form.controls["drugadverseeffect"].updateValueAndValidity(); // Update status
  }

  adrightAll(): void {
    this.newDrug.drugadverseeffects = this.availablelist1.selectAll().map(option => {
      console.log(option.value)
      const drugadverseeffect = new Drugadverseeffect( option.value);
      this.adverseeffects = this.adverseeffects.filter(ad => ad !== option.value);
      this.drugadverseeffects.push(drugadverseeffect)
      return drugadverseeffect;
    });

    this.form.controls["drugadverseeffect"].clearValidators();
    this.form.controls["drugadverseeffect"].updateValueAndValidity();
  }

  adleftSelected(): void {
    const selectedOptions = this.selectedlist1.selectedOptions.selected; // Right Side
    for (const option of selectedOptions) {
      const extAdeffect = option.value;
      this.drugadverseeffects = this.drugadverseeffects.filter(ad => {
        ad !== extAdeffect
      }); // Remove the Selected one From Right Side
      this.adverseeffects.push(extAdeffect);
    }

  }

  adleftAll(): void {
    for (let durgad of this.drugadverseeffects) this.adverseeffects.push(durgad.adverseeffect);
    this.drugadverseeffects = [];
  }

  inrightSelected(): void {
    this.availablelist2.selectedOptions.selected.map(option => {
      const drugindication = new Drugindication(option.value);
      this.indications = this.indications.filter(ad => ad !== option.value); //Remove Selected
      this.drugindications.push(drugindication); // Add selected to Right Side
      // this.a drugadverseeffect;
    });

    this.form.controls["drugindication"].clearValidators();
    this.form.controls["drugindication"].updateValueAndValidity(); // Update status
  }

  inrightAll(): void {
    this.availablelist2.selectAll().map(option => {
      const drugindication = new Drugindication(option.value);
      this.indications = this.indications.filter(ad => ad !== option.value);
      this.drugindications.push(drugindication);
    });
    this.form.controls["drugindication"].clearValidators();
    this.form.controls["drugindication"].updateValueAndValidity();
  }

  inleftSelected(): void {
    const selectedOptions = this.selectedlist2.selectedOptions.selected; // Right Side
    for (const option of selectedOptions) {
      const extdrugndication = option.value;
      this.drugindications = this.drugindications.filter(ad => {
        ad !== extdrugndication
      }); // Remove the Selected one From Right Side
      this.indications.push(extdrugndication.indication);
    }

  }

  inleftAll(): void {
    for (let drugin of this.drugindications) this.indications.push(drugin.indication);
    this.drugindications = [];
  }


  conrightSelected(): void {
    this.availablelist3.selectedOptions.selected.map(option => {
      const drugcontraindication = new Drugcontraindication(option.value);
      this.contraindications = this.contraindications.filter(ad => ad !== option.value); //Remove Selected
      this.drugcontraindications.push(drugcontraindication); // Add selected to Right Side
    });

    this.form.controls["drugcontaraindication"].clearValidators();
    this.form.controls["drugcontaraindication"].updateValueAndValidity(); // Update status
  }

  conrightAll(): void {
    this.availablelist3.selectAll().map(option => {
      const drugcontraindication = new Drugcontraindication(option.value);
      this.contraindications = this.contraindications.filter(ad => ad !== option.value);
      this.drugcontraindications.push(drugcontraindication);
    });
    this.form.controls["drugcontaraindication"].clearValidators();
    this.form.controls["drugcontaraindication"].updateValueAndValidity();
  }

  conleftSelected(): void {
    const selectedOptions = this.selectedlist3.selectedOptions.selected; // Right Side
    for (const option of selectedOptions) {
      const extdrugcontra = option.value;
      this.drugcontraindications = this.drugcontraindications.filter(ad => {
        ad !== extdrugcontra
      }); // Remove the Selected one From Right Side
      this.contraindications.push(extdrugcontra);
    }

  }

  conleftAll(): void {
    for (let drugcon of this.drugcontraindications) this.contraindications.push(drugcon.contraindication);
    this.drugcontraindications = [];
  }


  clear(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - " + this.title + " Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset()
      }
    });
  }


  backtoview() {
    this._location.back();
  }

}
