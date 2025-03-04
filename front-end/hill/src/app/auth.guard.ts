import { Injectable } from '@angular/core';
//import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
//import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true; // Allow access
    } else {
      this.router.navigate(['/login']); // Redirect to login
      return false; // Prevent access
    }
  }
}
