import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';

type FormType = 'login' | 'signup' | 'reset';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss'],
})
export class EmailLoginComponent implements OnInit {
  form: FormGroup;

  type: FormType = 'signup';
  loading = false;

  serverMessage: string = '';

  constructor(
    private fireAuth: AngularFireAuth,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordC: ['', []],
    });
  }

  changeType(type: FormType) {
    this.type = type;
  }

  get isLogin() {
    return this.type === 'login';
  }

  get isSignup() {
    return this.type === 'signup';
  }

  get isPasswordReset() {
    return this.type === 'reset';
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get passwordC() {
    return this.form.get('passwordC');
  }

  get passwordsMatch() {
    if (this.type !== 'signup') {
      return true;
    } else {
      return this.password?.value === this.passwordC?.value;
    }
  }

  async onSubmit() {
    this.loading = true;

    try {
      if (this.isLogin) {
        await this.fireAuth.signInWithEmailAndPassword(
          this.email.value,
          this.password.value
        );
      }
      if (this.isSignup) {
        await this.fireAuth.createUserWithEmailAndPassword(
          this.email.value,
          this.password.value
        );
      }
      if (this.isPasswordReset) {
        await this.fireAuth.sendPasswordResetEmail(this.email.value);
      }
    } catch (err) {
      this.serverMessage = err;
    }
  }
}
