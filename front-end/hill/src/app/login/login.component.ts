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

  constructor(
    private authService: AuthService,
    private router: Router) {}

  onSubmit() {
    // TODO: Fetch the API /login service
    // With authorization Basic hello:world
    // Payload {"username": this.username, "password": this.password}
    // Read the response token and save in the cookie
///*       
    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa('hello:world'));
    headers.set('Content-Type', 'application/json');

    const body = {
      username: this.username,
      password: this.password
    };

    fetch('http://localhost:8080/hill/webapi/login', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Login failed');
      }      
      return response.json();
    })
    .then(data => {
      console.log(data.token);
      this.authService.saveUser(data.token, 7);
      this.router.navigate(['/']);
    })
    .catch(error => {
      console.error('Login error:', error);
      // Display error message to user
    });
//*/

/*
    // Add your authentication logic here
    if (this.username === 'admin' && this.password === 'admin') {
      // Successful login
      this.authService.saveUser('jwt.token.sign', 7); // Set cookie
      this.router.navigate(['/']); // Navigate to home
    } else {
      // Handle login error
      console.log('Login failed');
    }    
*/    
  }
  
  ngOnInit(): void {
  }

}
  