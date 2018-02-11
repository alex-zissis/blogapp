import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Category } from './category';

@Injectable()
export class CategoryService {

  result: any;
  apiPath = '/api/';
  // apiPath = '/api/v2/'

  constructor(private _http: Http) { }

  getCategoryInfo(name) {
    return this._http.get(this.apiPath + 'categories/info/' + name)
      .map(result => this.result = result.json());
  }

  getCategories() {
    return this._http.get(this.apiPath + 'categories/all/')
      .map(result => this.result = result.json());
  }
}
