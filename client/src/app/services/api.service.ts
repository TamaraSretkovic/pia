import { Injectable } from '@angular/core';
import { HttpClient }    from '@angular/common/http';
import { CredentialsModel } from '../models/credentials.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:3000/v0.1/';
  registerUtl = 'register';
  loginUrl = 'login';
  usernamesUrl = 'usernames';
  checkEmailUrl = 'checkEmail';

  login(credentials: CredentialsModel): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${this.loginUrl}`,
      {username: credentials.username, password: credentials.password});
  }

  isUserLoggedIn(): boolean {
    return localStorage.getItem('username') != undefined;
  }

  register() {

  }

  getUsernames() {

  }

  checkEmail() {

  }


}
