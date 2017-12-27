import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFrm: FormGroup;

  constructor(private fb : FormBuilder, private _authService : AuthService, private router: Router) { }

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
      password : values.password
    }

    this._authService.login(payload)
      .subscribe(res => {
        this._authService.setToken(res.token);
        this.router.navigateByUrl('/');
      });
  }
}
