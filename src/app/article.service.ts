import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Article } from './article';
import { AuthService } from './auth.service';

@Injectable()
export class ArticleService {

  result:any;

  constructor(private _http: Http, private _authService : AuthService) { }

  getArticles() {
	  return this._http.get("/api/all")
	    .map(result => this.result = result.json());
  }

  getArticlesByCategory(cat) {
	  return this._http.get("/api/articles/category/"+cat)
	    .map(result => this.result = result.json());
  }

  getArticlesByAuthor(auth) {
	  return this._http.get("/api/articles/author/"+auth)
	    .map(result => this.result = result.json());
  }

  getArticle(id) {
  	return this._http.get("/api/articles/"+id)
  		.map(result => this.result = result.json());
  }

  insertArticle(post: Article) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this._authService.getToken()}`);
    const options = new RequestOptions({ headers: headers });

    return this._http.post('/api/create', JSON.stringify(post), options)
      .map(result => this.result = result.json());
  }

  updateArticle(id, post){
    let headers = new Headers({ 'Content-Type': 'application/json'});
    headers.append('Authorization', `Bearer ${this._authService.getToken()}`);
    const options = new RequestOptions({ headers: headers });
    return this._http.patch('/api/articles/update/'+ id, JSON.stringify(post), options)
      .map(result => this.result = result.json());
  }

  deleteArticle(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this._authService.getToken()}`);
    const options = new RequestOptions({ headers: headers });
    const payload = {
      id: id
    };
    return this._http.patch('/api/articles/delete/' + id, JSON.stringify(payload), options)
      .map(result => this.result = result.json());
  }
}
