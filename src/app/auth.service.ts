import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  result:any;

  constructor(private _http: Http) { }

  register(user) {
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    return this._http.post('/api/users/register', JSON.stringify(user), options)
      .map(result => this.result = result.json());
  }
}
