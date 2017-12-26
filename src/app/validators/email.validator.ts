import {AbstractControl} from '@angular/forms';
export class EmailValidation {

    static EmailValid(AC: AbstractControl) {
       let email = AC.get('email').value; // to get value in input tag
       if(!validMail(email)){
            AC.get('email').setErrors( {EmailValid: true} )
        } else {
            return null;
        }

    }
}

function validMail(mail) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(mail != null){
        mail = mail.toLowerCase();
    }
    return re.test(mail);
}