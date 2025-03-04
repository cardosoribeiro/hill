import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router'; // Import Router
import { AuthService } from '../auth.service';   

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  title = 'Hill';
  userName = 'José';
  currentPage = 'prime';
  visibleSidebar: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      routerLink: '/' // Route to Home component
    },
    {
      label: 'Users',
      icon: 'pi pi-fw pi-users',
      routerLink: '/users' // Route to Users component
    },
    {
      label: 'Settings',
      icon: 'pi pi-fw pi-cog',
      routerLink: '/settings' // Route to Settings component
    }
  ];

  logout() {
    // Here I want do back to the login page
    this.authService.logout();
    this.router.navigate(['/login']); // Navigate to login
  }

}
