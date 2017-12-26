import {AbstractControl} from '@angular/forms';
export class FormCheck {

    static Checked(AC: AbstractControl) {
        let password = AC.get('password').valid; // to get value in input tag
        let password2 = AC.get('password2').valid
        let email = AC.get('email').valid
        let fname = AC.get('fname').valid
        let lname = AC.get('lname').valid
        let username = AC.get('username').valid

        if(password && password2 && email && fname && lname && username){
            document.getElementById("regArtContainer").style.borderLeft = "10px solid #57e463";
        } else {
            document.getElementById("regArtContainer").style.borderLeft = "10px solid #e2623b";
        }
        return null
    }
}