import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ArticleService {

  result:any;

  constructor(private _http: Http) { }

  getArticles() {
	return this._http.get("/api/all")
	.map(result => this.result = result.json());
  }

  getArticle(id) {
  	return this._http.get("/api/articles/"+id)
  		.map(result => this.result = result.json());
  }
}
