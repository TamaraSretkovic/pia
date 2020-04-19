import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private service: ApiService, private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.service.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    if (`${next.url}` === 'admin') {
      if (this.service.getUserType() !== 'admin' && this.service.getUserType() !== 'farmer') {
        this.router.navigate(['/company']);
      } else if (this.service.getUserType() !== 'admin' && this.service.getUserType() !== 'company') {
        this.router.navigate(['/farmer']);
      } else {
        return this.service.getUserType() === 'admin';
      }
    } else if (`${next.url}` === 'farmer') {
      if (this.service.getUserType() !== 'farmer' && this.service.getUserType() !== 'company') {
        this.router.navigate(['/admin']);
      } else if (this.service.getUserType() !== 'farmer' && this.service.getUserType() !== 'admin') {
        this.router.navigate(['/company']);
      } else {
        return this.service.getUserType() === 'farmer';
      }
    } else if (`${next.url}` === 'company') {
      if (this.service.getUserType() !== 'farmer' && this.service.getUserType() !== 'company') {
        this.router.navigate(['/admin']);
      } else if (this.service.getUserType() !== 'company' && this.service.getUserType() !== 'admin') {
        this.router.navigate(['/farmer']);
      } else {
        return this.service.getUserType() === 'company';
      }
    }
    return this.service.isLoggedIn();
  }
}
