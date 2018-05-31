import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private _userService: UserService, private _router: Router) {}
  canActivate() {
    const identity = this._userService.getIdentity();

    if (identity && (identity.role === 'ROLE_USER' || identity.role === 'ROLE_ADMIN')) {
      return true;
    } else {
      this._router.navigate(['/login']);
      return false;
    }
  }
}
