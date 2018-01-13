import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
import { Observable } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  isLoggedIn : Observable<boolean>;


  constructor(private _authService : AuthService) {
    this.isLoggedIn = _authService.isLoggedInObvs();
   }


  ngOnInit() {
  }

  logout() {
    this._authService.isLoginSubject.next(false);
    this._authService.logout();
  }
}
