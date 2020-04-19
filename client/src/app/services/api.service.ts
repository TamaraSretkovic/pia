import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'angular2-cookie/core';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    baseUrl = '';
    loginUrl = '/v0.1/login';
    registerUserUrl = '/v0.1/register_user';
    changePasswordUrl = '/v0.1/change_password';
    registrationRequestsUrl = '/v0.1/registration_request';
    usersUrl = '/v0.1/users';

    constructor(private router: Router, private http: HttpClient,
        private cookieService: CookieService) {
            this.setBaseUrl(`${window.location.protocol}//${window.location.hostname}:3000`);
        }

    // ***** init *****

    setBaseUrl(url: string): void {
        this.baseUrl = url;
    }

    // ***** user stuff *****

    setCredentials(username, userType, token): void {
        this.cookieService.put('username', username);
        this.cookieService.put('token', token);
        this.cookieService.put('userType', userType);
    }

    clearCredentials(): void {
        document.execCommand('ClearAuthenticationCache');
        this.cookieService.remove('token');
        this.cookieService.remove('username');
        this.cookieService.remove('userType');
    }

    getUsername(): string {
        return this.cookieService.get('username');
    }
    // ***** login stuff ******

    isLoggedIn(): boolean {
        return this.getToken() !== undefined;
    }

    getToken(): string {
        return this.cookieService.get('token');
    }

    getUserType(): string {
        return this.cookieService.get('userType');
    }

    logOutUser(): void {
        this.clearCredentials();
        this.cookieService.removeAll();
        this.router.navigate(['/']);
    }

    nextPage():void {
        if(this.getUserType() == 'admin') {
            this.router.navigate(['/admin']);
        } else if (this.getUserType() == 'farmer') {
            this.router.navigate(['/farmer']);
        } else if(this.getUserType() == 'company') {
            this.router.navigate(['/company']);
        }
    }

    login(user: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.loginUrl}`, user);
    }

    // **** registration stuff ****

    registrationRequest(userInfo: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.registrationRequestsUrl}`, userInfo);
    }

    changePassword(oldPassword: any, password: any): Observable<any> {
        const changeP = {
            username: this.getUsername(),
            password: password,
            oldPassword: oldPassword
        }
        return this.http.post<any>(`${this.baseUrl}${this.changePasswordUrl}`, changeP);
    }

    // **** admin stuff ****

    // registration requests

    getRegistrationRequests(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}${this.registrationRequestsUrl}`);
    }

    deleteUserRegistrationRequest(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}${this.registrationRequestsUrl}/${id}`);
    }

    registerRequest(userInfo: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.registrationRequestsUrl}`, userInfo);
    }

    registerUser(userInfo: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.registerUserUrl}`, userInfo);
    }

    // users

    getUsers(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}${this.usersUrl}`);
    }
    
    deleteUser(username: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}${this.usersUrl}/${username}`);
    }

    updateUser(user: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.usersUrl}`, user);
    }
}