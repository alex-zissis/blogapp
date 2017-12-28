import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  isMessage : boolean = false;
  message : string;
  constructor() { }

  ngOnInit() {
  }

  display(errObj) {
    this.isMessage = true;
    switch (errObj.type) {
      case "error":
        document.getElementById('error').style.backgroundColor = "#db947f";
        document.getElementById('error').style.border = "1px solid #ad3f1b";
        break;
      case "warning":
        document.getElementById('error').style.backgroundColor = "#e7d3a6";
        document.getElementById('error').style.border = "1px solid #dfa62d";
        break;

      case "success":
        document.getElementById('error').style.backgroundColor = "#a9e0a1";
        document.getElementById('error').style.border = "1px solid #2c8a06";
        break;
    }

    this.message = errObj.message;
  }

}