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

  drugindications: Array<Drugindication> = [];
  drugadverseeffects: Array<Drugadverseeffect> = [];
  drugcontraindications: Array<Drugcontraindication> = [];

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
      console.log('arraya drug',drug)
     if (drug.photo != null) {
        this.imagedrugpurl = atob(drug.photo);
      }
      this.drug = drug


      this.drugindications = this.drug.drugindications;
      this.drugcontraindications = this.drug.drugcontraindications;
      this.drugadverseeffects = this.drug.drugadverseeffects
    });
    this.initialize();


  }
  initialize() {
    // @ts-ignore
    // this.ds.get(this.id).then((drug: Drug) => {

    //   this.indications = drug.indications;
    //   this.contraindications = drug.contraindications;
    //   this.adverseeffects = drug.adverseeffects;
    //   if (drug.photo != null) {
    //     this.imagedrugpurl = atob(drug.photo);
    //   }
    //   console.log(this.adverseeffects)
    //   console.log(this.indications)
    //   console.log(this.contraindications)
    //   this.drug = drug
    // });

  }

  backtoview() {
    this._location.back();
  }

  updateform() {
    this.router.navigateByUrl('main/drug/update/'+this.id);
  }

  protected readonly Drugindication = Drugindication;
  protected readonly Drugcontraindication = Drugcontraindication;
}
