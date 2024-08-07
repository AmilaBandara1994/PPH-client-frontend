import { Component } from '@angular/core';
import {Investigation} from "../../../../entity/investigation";
import {InvestigationService} from "../../../../service/investigationservice";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-investigation-details',
  templateUrl: './investigation-details.component.html',
  styleUrls: ['./investigation-details.component.css']
})
export class InvestigationDetailsComponent {

  title:string = 'Investigation';
  investigation!: Investigation;
  id!: number ;
  imagediagnosispurl: string ="assets/my-img/banner/diagnosis-bg.jpg";

  constructor(
    private ds:InvestigationService,
    private arouter:ActivatedRoute,
    private _location: Location,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.id = this.arouter.snapshot.params['id'];
    // @ts-ignore
    this.ds.get(this.id).then((investigation: Investigation) => {
      this.investigation = investigation
      console.log(investigation)
    });
    this.initialize();
  }
  initialize() {
  }
  backtoview() {
    this._location.back();
  }
  updateform() {
    this.router.navigateByUrl('main/investigation/update/'+this.id);
  }
}
