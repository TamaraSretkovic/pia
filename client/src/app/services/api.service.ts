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
    registerFarmerUrl = '/v0.1/register_farmer';
    registerCompanyUrl = '/v0.1/register_company';
    changePasswordUrl = '/v0.1/change_password';
    companyRequestsUrl = '/v0.1/company_requests';
    farmerRequestsUrl = '/v0.1/farmer_requests';
    farmerUsersUrl = '/v0.1/farmer_users';
    companyUsersUrl = '/v0.1/company_users';

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
        }
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