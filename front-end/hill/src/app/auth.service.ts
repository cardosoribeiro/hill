import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  private getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  }

  private  setCookie(name: string, value: string, days: number = 7): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    //Does indeed add (or update) a cookie in the user's browser.
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  }

  private  deleteCookie(name: string): void {
    this.setCookie(name, '', -1);
  }

  isAuthenticated(): boolean {
    return this.getCookie('your_auth_cookie') !== null; // Check for cookie
  }

  saveUser(token: string, expires: number): void {
    this.setCookie('your_auth_cookie', token, expires);  
  }


  logout() {
    this.deleteCookie('your_auth_cookie'); // Delete cookie
    this.router.navigate(['/login']);
  }
}