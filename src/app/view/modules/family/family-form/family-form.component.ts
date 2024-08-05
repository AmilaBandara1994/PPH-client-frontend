import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Employee} from "../../../../entity/employee";
import {EmployeeService} from "../../../../service/employeeservice";
import {DatePipe, Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {RegexService} from "../../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationManager} from "../../../../service/authorizationmanager";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {Familystatus} from "../../../../entity/familystatus";
import {District} from "../../../../entity/district";
import {Family} from "../../../../entity/family";
import {Familyservice} from "../../../../service/familyservice";
import {FamilystatusService} from "../../../../service/familystatus.service";
import {DistrictService} from "../../../../service/district.service";

@Component({
  selector: 'app-family-form',
  templateUrl: './family-form.component.html',
  styleUrls: ['./family-form.component.css']
})
export class FamilyFormComponent {

  imagefamilypurl: string = 'assets/my-img/banner/familys.jpg'

  title: string = "Family"
  public form!: FormGroup;
  updateForm: boolean = false;
  id!: number;
  // sclinicisempty!:boolean;

  newFamily!: Family;
  oldFamily!: Family;

  // selectedrow: any;

  employees: Array<Employee> = [];
  familystatuses: Array<Familystatus> = [];
  districts: Array<District> = [];

  code!: string;
  name!: string;

  regexes: any;

  constructor(
    private familystatusService: FamilystatusService,
    private districtService: DistrictService,
    private empservice: EmployeeService,
    private familyservice: Familyservice,

    private _location: Location,
    private arouter: ActivatedRoute,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService: AuthorizationManager) {


    this.form = this.fb.group({
      "district": new FormControl('', [Validators.required]),
      "name": new FormControl('', [Validators.required]),
      "address": new FormControl('', [Validators.required]),
      "mobile": new FormControl('', [Validators.required]),
      "land": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "maplocation": new FormControl(),
      "familystatus": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});


  }

  ngOnInit() {

    this.id = this.arouter.snapshot.params['id'];
    if (this.arouter.snapshot.params['id']) {
      // @ts-ignore
      this.familyservice.get(this.id).then((family: Family) => {
        this.oldFamily = family;
        this.newFamily = family;
        this.updateForm = true;
        console.log(this.newFamily);
        this.fillForm();
      });

    }


    this.initialize();
  }

  initialize() {

    this.empservice.getAll('').then((emp: Employee[]) => {
      this.employees = emp;
    });
    this.familystatusService.getAllList().then((familystatuses: Familystatus[]) => {
      this.familystatuses = familystatuses;
    });
    this.districtService.getAllList().then((districts: District[]) => {
      this.districts = districts;
    });

    this.rs.get('families').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });
    // this.getscheduledclinic();
    // this.getcountbyclinic();
  }


  createForm() {

    this.form.controls['district'].setValidators([Validators.required]);
    this.form.controls['name'].setValidators([Validators.required]);
    this.form.controls['address'].setValidators([Validators.required]);
    this.form.controls['mobile'].setValidators([Validators.required]);
    this.form.controls['land'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['maplocation'].setValidators([]);
    this.form.controls['familystatus'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.newFamily != undefined && control.valid) {
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
      this.newFamily = this.form.getRawValue()

      let formdata: string = "";

      formdata = formdata + "<br>  Family Name  : " + this.newFamily.name;
      formdata = formdata + "<br> Mobile id : " + this.newFamily.mobile;
      formdata = formdata + "<br>  Address  : " + this.newFamily.address;
      formdata = formdata + "<br>  District  : " + this.newFamily.district.name;

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

          console.log(this.newFamily)
          console.log('this  is family ', this.newFamily)
          this.familyservice.add(this.newFamily).then((responce: [] | undefined) => {
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

  fillForm() {

    if (this.newFamily != undefined) {

      //@ts-ignore
      this.newFamily.district = this.districts.find(a => a.id === this.newFamily.district.id);
      //@ts-ignore
      this.newFamily.famiys = this.familyforms.find(p => p.id === this.newFamily.familyform.id);
      //@ts-ignore
      this.newFamily.employee = this.employees.find(e => e.id === this.newFamily.employee.id);

      //@ts-ignore
      this.newFamily.familystatus = this.familystatuses.find(a => a.id === this.newFamily.familystatus.id);

      this.form.patchValue(this.newFamily);
      this.form.markAsPristine();
    }

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
            this.newFamily = this.form.getRawValue();



            console.log(this.newFamily)
            this.familyservice.update(this.newFamily).then((responce: [] | undefined) => {
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
