import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {

  // store the URL so we can redirect after logging in
  redirectUrl: string = '/';

  private token: string = '';  //cache

  constructor(private http: Http, private router: Router) { }

  public getToken() {
    return this.token || localStorage.getItem('token');
  }
  private setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }
  private removeToken() {
    this.token = '';
    localStorage.removeItem('token');
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post('/api/authenticate', JSON.stringify({ username: username, password: password }))
      .map((response: Response) => {
        let data = response.json();
        if (data.token) {
          this.setToken(data.token);
          this.router.navigate([ this.redirectUrl === '/login' ? '/' : this.redirectUrl]);
        }
        return data;
      });
  }

  logout(): Observable<any> {
    this.removeToken();
    this.router.navigate(['/login']);
    return null;
  }
}
