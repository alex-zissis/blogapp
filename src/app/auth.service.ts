import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ErrorService } from './error.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from "rxjs";
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  result: any;
  storageKey: string = 'blogapp-jwt';

  constructor(private _http: Http, private router: Router, private _errorService : ErrorService) { }

  isLoginSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  isLoggedInObvs() : Observable<boolean> {
    return this.isLoginSubject.asObservable();
   }

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

  clearToken(){
    return localStorage.removeItem(this.storageKey);
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  logout() {
    this.clearToken();
    let errObj = {
      type : 'success',
      name : 'logout',
      message : 'Successfully logged out.',
      statusCode : 200,
      expires : false
    }
    this.error(errObj);
  }

  getUserInfo() {
      let headers = new Headers();
      headers.append( 'Authorization', `Bearer ${this.getToken()}`);
      let options = new RequestOptions({ headers: headers });
      
      return this._http.get('/api/users/me', options)
        .map(result => this.result = result.json());
    }

  error(err) {
    this._errorService.showError(err);
  }
}
