import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { SnackService } from '../services/snack.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private fireAuth: AngularFireAuth, private snack: SnackService) {}

  async canActivate(
    _: ActivatedRouteSnapshot,
    __: RouterStateSnapshot
  ): Promise<boolean> {
    const user = await this.fireAuth.currentUser;
    const isLoggedIn = !!user;

    if (!isLoggedIn) {
      this.snack.authError();
    }
    return isLoggedIn;
  }
}
