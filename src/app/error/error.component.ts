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
  
  constructor(private _errorService: ErrorService) {
    this.subscription = this._errorService.currentMessage.subscribe(obj => { 
      this.isMessage = true;
      this.errorObject = obj; 
      this.display(this.errorObject);
  }); 
}

  ngOnInit() {
  }

  display(errObj) {
    switch (errObj.type) {
      case "error":
        document.getElementById('error').style.backgroundColor = "#db947f";
        document.getElementById('error').style.border = "1px solid #ad3f1b";
        document.getElementById('error').style.marginBottom = "30px";
        break;
      case "warning":
        document.getElementById('error').style.backgroundColor = "#e7d3a6";
        document.getElementById('error').style.border = "1px solid #dfa62d";
        document.getElementById('error').style.marginBottom = "30px";
        break;
      case "success":
        document.getElementById('error').style.backgroundColor = "#a9e0a1";
        document.getElementById('error').style.border = "1px solid #2c8a06";
        document.getElementById('error').style.marginBottom = "30px";
        break;
    }
    setTimeout(function() {
      this.isMessage = false;
      document.getElementById('error').style.backgroundColor = "transparent";
      document.getElementById('error').style.border = "none";
      document.getElementById('error').style.marginBottom = "0";
  }.bind(this), 5000);
  }
}

export class ErrorObject {
  type: string;
  message: string;
  statusCode: number;
}