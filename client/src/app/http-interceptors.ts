import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ApiService } from './services/api.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
    constructor(private service: ApiService) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {
        if (this.service.isLoggedIn()) {
            const authData = this.service.getAuthData();
            req = req.clone({
                setHeaders: {
                    Authorization: `Basic ${authData}`,
                },
            });
        }
        return next.handle(req);
    }
}
