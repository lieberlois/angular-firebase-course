import { Directive, HostListener } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Directive({
  selector: '[appGoogleSignin]',
})
export class GoogleSigninDirective {
  constructor(private fireAuth: AngularFireAuth) {}

  @HostListener('click')
  onclick() {
    this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}
