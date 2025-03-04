import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    console.log('Username:', this.username);
    console.log('Password:', this.password);

    // TODO: Fetch the API /login service
    // With authorization Basic hello:world
    // Payload {"username": this.username, "password": this.password}
    // Read the response token and save in the cookie

    // Add your authentication logic here
    if (this.username === 'admin' && this.password === 'admin') {
      // Successful login
      this.authService.setCookie('your_auth_cookie', 'your_auth_token', 7); // Set cookie
      this.router.navigate(['/home']); // Navigate to home
    } else {
      // Handle login error
      console.log('Login failed');
    }    
  }
  
  ngOnInit(): void {
  }

}
  