import {AbstractControl} from '@angular/forms';
export class FormCheck {

    static Checked(AC: AbstractControl) {
        const password = AC.get('password').valid; // to get value in input tag
        const password2 = AC.get('password2').valid;
        const email = AC.get('email').valid;
        const fname = AC.get('fname').valid;
        const lname = AC.get('lname').valid;
        const username = AC.get('username').valid;

        if (password && password2 && email && fname && lname && username) {
            document.getElementById('regArtContainer').style.borderLeft = '10px solid #57e463';
        } else {
            document.getElementById('regArtContainer').style.borderLeft = '10px solid #e2623b';
        }
        return null;
    }
}
