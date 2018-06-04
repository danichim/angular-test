import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './service/authentication.service'

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.getToken()) {
      // logged in so return true
      return true;
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = state.url;

    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }
}
