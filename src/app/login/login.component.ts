import { Component } from '@angular/core';

import { AuthenticationService } from '../service/authentication.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  model: any = {};
  loading = false;

  errMsg: string = '';

  constructor(private authenticationService: AuthenticationService) { }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe( data => {
          this.errMsg = data.errMsg || '';
          this.loading = false
        },
        error => {
          console.log(error)
        });
  }
}
