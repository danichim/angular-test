import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// used to create fake backend
import { fakeBackendProvider } from './domain/fake-backend';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { PageNotFoundComponent } from './not-found.component';

import { AuthGuard } from './auth.guard';
import { AuthenticationService } from './service/authentication.service';
import { UserService } from './service/user.service';
import { HomeComponent } from './home/home.component';
import { HomeHeaderComponent } from './home/header/header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { GenderPipe } from './pipe';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HomeComponent,
    HomeHeaderComponent,
    LoginComponent,
    RegisterComponent,
    GenderPipe
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    UserService,

    // providers used to create fake backend
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
