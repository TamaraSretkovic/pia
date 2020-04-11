import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'angular2-cookie/core';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    baseUrl = 'http://localhost:5000';
    loginUrl = '/v0.1/credential';
    registerFarmerUrl = '/v0.1/register_farmer';
    registerCompanyUrl = '/v0.1/register_company';

    constructor(private router: Router, private http: HttpClient,
        private cookieService: CookieService) { }

    // ***** init *****

    setBaseUrl(url: string): void {
        // this.baseUrl = url;
    }

    // ***** user stuff *****

    setCredentials(username, password): void {
        this.cookieService.put('username', username);
        const encoded = btoa(`${username}:${password}`);
        this.cookieService.put('authdata', encoded);
    }

    clearCredentials(): void {
        document.execCommand('ClearAuthenticationCache');
        this.cookieService.remove('authdata');
        this.cookieService.remove('username');
    }

    // ***** login stuff ******

    isLoggedIn(): boolean {
        return this.getAuthData() !== undefined;
    }

    getAuthData(): string {
        return this.cookieService.get('authdata');
    }

    logOutUser(): void {
        this.clearCredentials();
        this.cookieService.removeAll();
        this.router.navigate(['/login']);
    }

    nextPage(userType: string):void {
        //to do
    }

    login(user: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.loginUrl}`, user);
    }

    // **** registration stuff ****

    registerFarmer(userInfo: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.registerFarmerUrl}`, userInfo);
    }

    registerCompany(userInfo: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.registerCompanyUrl}`, userInfo);
    }
}