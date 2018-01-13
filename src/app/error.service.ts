import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ErrorService {
  private subject = new Subject<any>();
  currentMessage = this.subject.asObservable();

  showError(errPassed : object){
    this.subject.next(errPassed);
  }

}
