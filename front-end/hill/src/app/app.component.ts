import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Hill';
  userName = 'José';
  currentPage = 'prime';
  visibleSidebar: boolean = false;

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
    
  }
}
