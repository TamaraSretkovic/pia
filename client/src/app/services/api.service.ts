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
    changePasswordUrl = '/v0.1/change_password';
    companyRequestsUrl = '/v0.1/company_requests';
    farmerRequestsUrl = '/v0.1/farmer_requests';
    farmerUsersUrl = '/v0.1/farmer_users';
    companyUsersUrl = '/v0.1/company_users';

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

    getUsername(): string {
        return this.cookieService.get('username');
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
        this.router.navigate(['/']);
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

    changePassword(password: any): Observable<any> {
        const changeP = {
            username: this.getUsername(),
            password: password
        }
        return this.http.post<any>(`${this.baseUrl}${this.changePasswordUrl}`, changeP);
    }

    // **** admin stuff ****

    //get everything

    getCompanyRequests(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}${this.companyRequestsUrl}`);
    }

    getFarmerRequests(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}${this.farmerRequestsUrl}`);
    }

    getCompanyUsers(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}${this.companyUsersUrl}`);
    }

    getFarmerUsers(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}${this.farmerUsersUrl}`);
    }

    // accept/reject requests

    acceptCompanyRequests(accept: boolean, id: number): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.companyRequestsUrl}`, {accept: accept, id: id});
    }

    acceptFarmerRequests(accept: boolean, id: number): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.farmerRequestsUrl}`, {accept: accept, id: id});
    }

    // delete user

    deleteCompanyUser(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}${this.companyUsersUrl}/${id}`);
    }

    deleteFarmerUser(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}${this.farmerUsersUrl}/${id}`);
    }

    // update user

    updateCompanyUser(user: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.companyUsersUrl}`, user);
    }

    updateFarmerUser(user: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.farmerUsersUrl}`, user);
    }
}