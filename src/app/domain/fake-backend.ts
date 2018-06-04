﻿import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { User } from './user.model'

export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {


  //array in local storage for registered users
  let users: User[] = [
    { id: 3000, username: 'test', fullname:'Test B', email:'test@dan.me', confirmpassword:'test', password: 'test', gender: 'M', birthday: new Date('1996-10-06'), hobby: 'Ski'},
    { id: 3001, username: 'dan', fullname:'Test A', email:'angular4@dan.me', confirmpassword:'parola', password: 'parola', gender: 'M', birthday: new Date('1991-08-02'), hobby: 'Volei'},
  ];

  // simulate server api call
  backend.connections.subscribe((connection: MockConnection) => {

    // 500ms timeout
    setTimeout(() => {

      // login authenticate
      if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === RequestMethod.Post) {
        // get parameters from post request
        let params = JSON.parse(connection.request.getBody());

        // find if any user matches login credentials
        let filteredUsers = users.filter(user => {
          return user.username === params.username && user.password === params.password;
        });

        if (filteredUsers.length) {
          // if login details are valid return 200 OK with user details and fake jwt token
          let user = filteredUsers[0];
          connection.mockRespond(new Response(new ResponseOptions({
            status: 200,
            body: {
              user: user,
              token: 'fake-json-web-token' + user.id
            }
          })));
        } else  if (filteredUsers.length === 0) {
          connection.mockRespond(new Response(new ResponseOptions({status: 200, body: { errMsg: 'Invalid username or password'} })));
        } else {
          // else return 400 bad request
          connection.mockError(new Error());
        }

        return;
      }

      // get users
      if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Get) {
        // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
        if (connection.request.headers.get('Authorization').indexOf('Bearer fake-json-web-token') === 0) {
          connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: users })));
        } else {
          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
        }

        return;
      }

      // get user by id
      if (connection.request.url.match(/\/api\/users\/\d+$/) && connection.request.method === RequestMethod.Get) {
        // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
        if (connection.request.headers.get('Authorization').indexOf('Bearer fake-json-web-token') === 0) {
          // find user by id in users array
          let urlParts = connection.request.url.split('/');
          let id = parseInt(urlParts[urlParts.length - 1]);
          let matchedUsers = users.filter(user => { return user.id === id; });
          let user = matchedUsers.length ? matchedUsers[0] : null;

          // respond 200 OK with user
          connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: user })));
        } else {
          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
        }

        return;
      }

      // create user
      if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Post) {
        // get new user object from post body
        let newUser = JSON.parse(connection.request.getBody());

        // validation
        let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
        if (duplicateUser) {
          // return connection.mockError(new Error('Username "' + newUser.username + '" is already taken'));
          connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: { success: false, error: '改用户已经存在' } })));
        } else {
          // save new user
          newUser.id = users[ users.length - 1 ].id + 1;
          users.push(newUser);

          // respond 200 OK
          connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: { success: true } })));
        }

        return;
      }

      // delete user
      if (connection.request.url.match(/\/api\/users\/\d+$/) && connection.request.method === RequestMethod.Delete) {
        // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
        if (connection.request.headers.get('Authorization').indexOf('Bearer fake-json-web-token') === 0) {
          // find user by id in users array
          let urlParts = connection.request.url.split('/');
          let id = parseInt(urlParts[urlParts.length - 1]);
          for (let i = 0; i < users.length; i++) {
            let user = users[i];
            if (user.id === id) {
              // delete user
              users.splice(i, 1);
              break;
            }
          }

          // respond 200 OK
          connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
        } else {
          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
        }

        return;
      }

      // pass through any requests not handled above
      let realHttp = new Http(realBackend, options);
      let requestOptions = new RequestOptions({
        method: connection.request.method,
        headers: connection.request.headers,
        body: connection.request.getBody(),
        url: connection.request.url,
        withCredentials: connection.request.withCredentials,
        responseType: connection.request.responseType
      });
      realHttp.request(connection.request.url, requestOptions)
        .subscribe((response: Response) => {
            connection.mockRespond(response);
          },
          (error: any) => {
            connection.mockError(error);
          });

    }, 500);

  });

  return new Http(backend, options);
};

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: Http,
  useFactory: fakeBackendFactory,
  deps: [MockBackend, BaseRequestOptions, XHRBackend]
};
