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

  isLoggedIn: Observable<boolean>;
  hasToken: boolean;
  user: any;
  loading = true;

  constructor(private _authService: AuthService,
    private _errorService: ErrorService,
    private router: Router) {
      this.isLoggedIn = _authService.isLoggedInObvs();
      this.hasToken = _authService.isLoggedIn();
  }

  ngOnInit() {

    if (this.hasToken) {
      this._authService.getUserInfo()
      .subscribe(res => {
        this._authService.isLoginSubject.next(true);
        this.user = res;
        this.loading = false;
      }, err => {
        if (this.isLoggedIn) {
          const response = JSON.parse(err._body);
          this._authService.clearToken();
          const errObj = {
            type: 'error',
            name: response.type,
            message: response.message,
            statusCode: 401,
            expires: true
          };
          this._authService.isLoginSubject.next(false);
          this.pushError(errObj);
          this.router.navigateByUrl('/login');
        }
      });
    } else {
      this.loading = false;
    }
  }

  pushError(err) {
    this._errorService.showError(err);
  }
}
