import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Adverseeffect} from "../entity/adverseeffect";

@Injectable({
  providedIn: 'root'
})
export class Adverseeffectservice {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Adverseeffect>> {
    const adverseeffects = await this.http.get<Array<Adverseeffect>>('http://localhost:8080/adverseeffects/list').toPromise();
    if(adverseeffects == undefined){
      return [];
    }
    return adverseeffects;
  }
}
