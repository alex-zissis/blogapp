import {AbstractControl} from '@angular/forms';
export class PasswordValid {

    static ValidPassword(AC: AbstractControl) {
       const password = AC.get('password').value; // to get value in input tag
       let valid = true;

       if (password) {
            if (password.length < 8 ) {
                valid = false;
            }

            let regex = /^(?=.*[a-z]).+$/;
            if (!regex.test(password) ) {
                valid = false;
            }

            regex = /^(?=.*[A-Z]).+$/;
            if (!regex.test(password) ) {
                valid = false;
            }

            regex = /^(?=.*[0-9_\W]).+$/;
            if (!regex.test(password) ) {
                valid = false;
            }
       }else {
           valid = false;
       }

       if (!valid) {
            AC.get('password').setErrors( {ValidPassword: true} );
        } else {
            return null;
        }
    }
}
