import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ErrorService } from '../error.service';
import { User } from '../user';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  user: any;
  isLoggedIn : Observable<boolean>;

  constructor(private _authService : AuthService, private _errorService : ErrorService, private router : Router) { 
    this.isLoggedIn = this._authService.isLoggedInObvs();
  }

  ngOnInit() {

    this._authService.getUserInfo()
      .subscribe(res => {
        this.user = res;
      }, err => {
        if(this.isLoggedIn._isScalar){
          let response = JSON.parse(err._body);
          this._authService.clearToken();
          let errObj = {
            type: "error",
            cat: response.type,
            message: response.message,
            statusCode: 401
          }
          this.pushError(errObj);
          this.router.navigateByUrl('/login');
        }
      });
  }

  pushError(err){
    this._errorService.showError(err);
  }
}
