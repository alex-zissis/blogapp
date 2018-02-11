import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ErrorService } from '../error.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFrm: FormGroup;

  constructor(private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private _errorService: ErrorService) { }

  ngOnInit() {
    this.loginFrm = this.fb.group({
      'username' : [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(15)])],
      'password' : [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])]
    });
  }

  onSubmit(loginFrmData) {
    const values = loginFrmData;

    const payload = {
      username : values.username,
      password : values.password,
    };

    this._authService.login(payload)
      .subscribe(res => {
        this._authService.isLoginSubject.next(true);
        this._authService.setToken(res.token);
        this.router.navigateByUrl('/');
      }, err => {
        const errObj = {
          type: 'error',
          name: 'badlogin',
          message: 'Incorrect username or password, please try again.',
          statusCode: 401,
          expires: true
        };
        this.pushError(errObj);
      });
  }

  pushError(err) {
    this._errorService.showError(err);
  }
}
