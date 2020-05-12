import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'angular2-cookie/core';
import { Seedling } from '../model/seedling.model';
import { Product } from '../model/product.model';

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
    nurseryUrl = '/v0.1/nursery';
    nurserysUrl = '/v0.1/nurserys';
    updateSeedlingUrl = '/v0.1/updateSeedling';
    saveNurseryChangesUrl = '/v0.1/updateNursery';
    warehouseUrl = '/v0.1/warehouse';
    storeUrl = '/v0.1/store';
    orderRequestUrl = '/v0.1/orderRequests';
    ordersUrl = '/v0.1/orders';
    soldItemsPerDayUrl = '/v0.1/soldItemsPerDay';
    productsUrl = '/v0.1/products';

    constructor(private router: Router, private http: HttpClient,
        private cookieService: CookieService) {
        this.setBaseUrl(`${window.location.protocol}//${window.location.hostname}:3000`);
    }

    // ***** init *****

    setBaseUrl(url: string): void {
        this.baseUrl = url;
    }

    // ***** user stuff *****

    setCredentials(username, userType, token, id): void {
        this.cookieService.put('username', username);
        this.cookieService.put('token', token);
        this.cookieService.put('userType', userType);
        this.cookieService.put('id', id);
    }

    clearCredentials(): void {
        document.execCommand('ClearAuthenticationCache');
        this.cookieService.remove('token');
        this.cookieService.remove('username');
        this.cookieService.remove('userType');
        this.cookieService.remove('id');
    }

    getId(): string {
        return this.cookieService.get('id');
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

    nextPage(): void {
        if (this.getUserType() == 'admin') {
            this.router.navigate(['/admin']);
        } else if (this.getUserType() == 'farmer') {
            this.router.navigate(['/farmer']);
        } else if (this.getUserType() == 'company') {
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

    // ***** farmer stuff ******

    getNurserys(id: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.nurserysUrl}`, { id: id });
    }

    getNursery(id: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}${this.nurseryUrl}/${id}`);
    }

    addNursery(nurseryInfo: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.nurseryUrl}`, nurseryInfo);
    }

    // ***** nursery stuff *****

    updateSeedling(seedInfo: Seedling, nurseryId: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.updateSeedlingUrl}`, { id: nurseryId, seedling: seedInfo });
    }

    saveNurseryChanges(nurseryId: string, temp: number, water: number): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.saveNurseryChangesUrl}`, { id: nurseryId, temp: temp, water: water });
    }

    // ***** warehouse stuff ****
    getWarehouse(nurseryId: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}${this.warehouseUrl}/${nurseryId}`);
    }

    updateWarehouse(nurseryId: string, seedlings: Seedling[], products: Product[]): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.warehouseUrl}`, { id: nurseryId, seedlings: seedlings, products: products });
    }

    getOrderRequests(nurseryId: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}${this.orderRequestUrl}/${nurseryId}`);
    }

    cancelOrderRequests(orderId: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}${this.orderRequestUrl}/${orderId}`);
    }

    getStore(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}${this.storeUrl}`);
    }

    order(orderings: any[]) {
        console.log(orderings);
        console.log('ovo su bile ordering');

        let orderRequests: any[] = [];
        let orderRequestsHelper: any[] = [];

        let found = false;
        orderings.forEach(element => {
            found = false;
            orderRequestsHelper.forEach(elementHelper => {
                if (element.companyId === elementHelper[0].companyId) {
                    elementHelper.push(element);
                    found = true;
                }
            });
            if (!found) {
                orderRequestsHelper.push([element]);
            }
        });
        orderRequestsHelper.forEach(elementHelper => {
            const order = {
                nurseryId: elementHelper[0].nurseryId,
                companyId: elementHelper[0].companyId,
                producer: elementHelper[0].producer,
                farmerUsername: this.getUsername(),
                products: []
            }
            elementHelper.forEach(product => {
                const productHelper = {
                    productId: product.productId,
                    name: product.name,
                    type: product.type,
                    quantity: product.quantity
                }
                order.products.push(productHelper);
            });
            orderRequests.push(order);
        });

        console.log(orderRequestsHelper);

        return this.http.post<any>(`${this.baseUrl}${this.orderRequestUrl}`, {requests: orderRequests});
    }

    // ****** company stuff *******

    getOrders(companyId: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}${this.ordersUrl}/${companyId}`);
    }

    rejectOrder(orderId: any): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}${this.ordersUrl}/${orderId}`);
    }

    acceptOrder(orderId: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.ordersUrl}`, {orderId: orderId});
    }
    soldItemsPerDay(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}${this.soldItemsPerDayUrl}/${this.getId()}`);
    }

    // ***** manage products *****

    getProducts(companyId: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}${this.productsUrl}/${companyId}`);
    }

    deleteProduct(productId: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}${this.productsUrl}/${productId}`);
    }

    updateProduct(productId: string, description: string, quantity: number, price: number): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}${this.productsUrl}/${productId}`,
            { quantity: quantity, description: description, price: price });
    }

    addProduct(productInfo: any): Observable<any> {
        const product = {
            name: productInfo.name,
            producer: this.getUsername(),
            quantity: productInfo.quantity,
            type: productInfo.type,
            price: productInfo.price,
            companyId: this.getId(),
            power: productInfo.power,
            description: productInfo.description
        }
        return this.http.post<any>(`${this.baseUrl}${this.productsUrl}`, product);
    }

}