import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Article } from './article';

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

  insertArticle(post: Article) {
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this._http.post('/api/create', JSON.stringify(post), options)
      .map(result => this.result = result.json());
  }

  updateArticle(id, post){
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    return this._http.patch('/api/articles/update/'+id, JSON.stringify(post), options)
      .map(result => this.result = result.json());
  }
}
