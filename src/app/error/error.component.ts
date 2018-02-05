import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../error.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  isMessage : boolean = false;
  errorObject : ErrorObject;
  subscription: Subscription;
  errArr = [];
  
  constructor(private _errorService: ErrorService) {
    this.subscription = this._errorService.currentMessage.subscribe(obj => { 
      this.errorObject = obj; 
      this.display(this.errorObject);
  }); 
}

  ngOnInit() {
  }

  display(errObj) {
    this.isMessage = true;

    switch (errObj.type) {
      case "error":
        //document.getElementById(id).style.backgroundColor = "#db947f";
        errObj.isErr = true;
        errObj.isInf = false;
        errObj.isSuc = false;
        errObj.isWar = false;
        break;
      case "warning":
        //document.getElementById(id).style.backgroundColor = "#e7d3a6";
        errObj.isErr = false;
        errObj.isInf = false;
        errObj.isSuc = false;
        errObj.isWar = true;
        break;
      case "success":
        //document.getElementById(id).style.backgroundColor = "#e7d3a6";
        errObj.isErr = false;
        errObj.isInf = false;
        errObj.isSuc = true;
        errObj.isWar = false;
        break;
      case "info":
        //document.getElementById(id).style.backgroundColor = "#0099FF";
        errObj.isErr = false;
        errObj.isInf = true;
        errObj.isSuc = false;
        errObj.isWar = false;
        break;
    }
    if(this.checkErrExists(errObj.name) == -1) {
      this.errArr.push(errObj);
      if(errObj.expires) {
        setTimeout(function() {
          this.hide(errObj.name);
        }.bind(this), 5000);
      }
    }

    

  }

  hide(name) {
    const index = this.checkErrExists(name);
    console.log(index);
    if(index === -1) {
      ///not found
    } else {
      this.errArr.splice(index, 1);
    }

    if(this.errArr.length == 0) {
      this.isMessage = false;
    }
  }

  checkErrExists(name) {
    let i = 0;
    let errFound = false;
    while (!errFound && i < this.errArr.length) {
      if(name == this.errArr[i].name) {
        errFound = true;
        this.errArr.splice(i, 1);
      }
      i++;
    }
    if(errFound) {
      return (i-1);
    } else {
      return -1;
    }
  }
}

export class ErrorObject {
  name: string;
  type: string;
  message: string;
  statusCode: number;
  expires: boolean;
}