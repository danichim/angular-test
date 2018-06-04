import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { User } from '../domain/user.model';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class UserService {

  private headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http, private authService: AuthenticationService) {
    this.headers.append('Authorization', 'Bearer ' + this.authService.getToken());
  }

  getAll(): Observable<any> {
    return this.http.get('/api/users', {headers: this.headers}).map((response: Response) => response.json());
  }

  getById(id: number): Observable<any> {
    return this.http.get('/api/users/' + id, {headers: this.headers}).map((response: Response) => response.json());
  }

  create(user: User): Observable<any> {
    return this.http.post('/api/users', user, {headers: this.headers}).map((response: Response) => response.json());
  }

  update(user: User): Observable<any> {
    return this.http.put('/api/users/' + user.id, user, {headers: this.headers}).map((response: Response) => response.json());
  }

  delete(id: number): Observable<any> {
    return this.http.delete('/api/users/' + id, {headers: this.headers}).map((response: Response) => response.json());
  }

  getCurrentUser(): Observable<any> {
    let id = this.authService.getToken().slice(19);
    return this.getById(+id);
  }
}
