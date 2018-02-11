import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
import { Observable } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  host : {
    '(window:scroll)': 'updateHeader($event)' // to review
  }
})
export class HeaderComponent implements OnInit {

  isLoggedIn: Observable<boolean>;
  stickyBar = false;
  currPos: Number = 0;
  startPos: Number = 0;
  changePos: Number = 25;

  constructor(private _authService: AuthService) {
    this.isLoggedIn = _authService.isLoggedInObvs();
   }

  ngOnInit() {
  }

  logout() {
    console.log(this.isLoggedIn)
    this._authService.isLoginSubject.next(false);
    this._authService.logout();
  }

  updateHeader(evt) {
     this.currPos = (window.pageYOffset || evt.target.scrollTop) - (evt.target.clientTop || 0);
        if (this.currPos >= this.changePos ) {
            this.stickyBar = true;
        } else {
            this.stickyBar = false;
        }
  }
}
