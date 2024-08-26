import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {Drug} from "../../../../entity/drug";
import {Drugservice} from "../../../../service/drugservice";
import {Drugindication} from "../../../../entity/drugindication";
import {Drugadverseeffect} from "../../../../entity/drugadverseeffect";
import {Drugcontraindication} from "../../../../entity/drugcontraindication";

@Component({
  selector: 'app-drug-details',
  templateUrl: './drug-details.component.html',
  styleUrls: ['./drug-details.component.css']
})
export class DrugDetailsComponent {

  drug!: Drug;
  id!: number ;
  imagedrugpurl: string ="assets/my-img/banner/pharmacy-bg.jpg";

  constructor(
    private ds:Drugservice,
    private arouter:ActivatedRoute,
    private _location: Location,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.id = this.arouter.snapshot.params['id'];
    // @ts-ignore
    this.ds.get(this.id).then((drug: Drug) => {
     if (drug.photo != null) {
        this.imagedrugpurl = atob(drug.photo);
      }
      this.drug = drug
    });
    this.initialize();

  }
  initialize() {
    window.scrollTo(0, 0);
  }
  backtoview() {
    this._location.back();
  }
  updateform() {
    this.router.navigateByUrl('main/drugs/update/'+this.id);
  }
}
