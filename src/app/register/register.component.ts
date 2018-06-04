import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../service/user.service';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  model: any = {};
  loading = false;

  errMsg: string = '';

  hobbies: any = [
    { id: 100, name: 'Ciclism'},
    { id: 101, name: 'Handbal'},
    { id: 102, name: 'Fotbal'},
    { id: 103, name: 'Ski'},
    { id: 104, name: 'Volei'},
    { id: 105, name: 'Hockey'},
    { id: 106, name: 'Innot'}
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    ) { }

  register() {
    this.loading = true;
    this.userService.create(this.model)
      .subscribe(
        data => {
          if (data.success) {
            //should go home here and already logged in
            this.router.navigate(['/login']);
          } else {
            this.loading = false;
            this.errMsg = data.error;
          }
        },
        error => {
          console.error(error)
        });
  }
}
