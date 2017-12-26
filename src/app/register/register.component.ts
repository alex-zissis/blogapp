import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidation } from '../validators/password-match.validator';
import { PasswordValid } from '../validators/password.validator';
import { EmailValidation } from '../validators/email.validator';
import { FormCheck } from '../validators/form-check.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  userFrm: FormGroup;

  constructor(private fb : FormBuilder) { }

  ngOnInit() {
    this.userFrm = this.fb.group({
      'username' : [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(15)])],
      'email' : [null, Validators.compose([Validators.required, Validators.maxLength(80)])],
      'fname' : [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
      'lname' : [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
      'password' : [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])],
      'password2' : [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])],
    },{
      validator: [PasswordValidation.MatchPassword, EmailValidation.EmailValid, PasswordValid.ValidPassword, FormCheck.Checked]
    });
  }
}
