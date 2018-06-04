import { Component, OnInit } from '@angular/core';

import { User } from '../domain/user.model';
import { AuthenticationService } from '../service/authentication.service';
import { UserService } from '../service/user.service';

@Component({
  templateUrl: './home.component.html',
  
})

export class HomeComponent implements OnInit {
  currentUser: User;
  users: User[] = [];

  constructor(private userService: UserService, private authService: AuthenticationService) {
    // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.getAllUsers();
    this.getCurrentUser()
  }

  private getAllUsers() {
    this.userService.getAll().subscribe(users => this.users = users);
  }
  private getCurrentUser() {
    this.userService.getCurrentUser().subscribe(user => this.currentUser = user)
  }

  logout(e) {
    this.authService.logout();
  }
}
