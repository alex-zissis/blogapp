import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ErrorService {
  private subject = new Subject<any>();
  currentMessage = this.subject.asObservable();
  prevName: String;

  showError(errPassed){
    if(errPassed.name != this.prevName) {
      this.subject.next(errPassed);
        setTimeout(function() {
          this.prevName = "";
        }.bind(this), 5000);
      }
    this.prevName = errPassed.name;
  }

}
