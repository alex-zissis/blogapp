import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  result:any;
  storageKey: string = 'blogapp-jwt'

  constructor(private _http: Http, private router: Router) { }

  register(user) {
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    return this._http.post('/api/users/register', JSON.stringify(user), options)
      .map(result => this.result = result.json());
  }

  login(payload) {
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    return this._http.post('/api/users/auth', JSON.stringify(payload), options)
      .map(result => this.result = result.json());
  }

  setToken(token : string) {
    localStorage.setItem(this.storageKey, token)
  }

  getToken(){
    return localStorage.getItem(this.storageKey);
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    this.router.navigateByUrl('/login');
  }
}
