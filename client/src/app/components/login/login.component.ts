import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  showErrorMessage = false;
  showServerErrorMessage = false;

  constructor(private router: Router, private service: ApiService) {
    // this.service.setBaseUrl(`${window.location.protocol}//${window.location.hostname}:${window.location.port}`);
    this.service.setBaseUrl(`${window.location.protocol}//${window.location.hostname}:${window.location.port}`);

  }

  login(): void {
    if (this.loginForm.invalid) {
      this.showErrorMessage = true;
      return;
    }
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    this.service.login(this.loginForm.value).subscribe(data => {
      this.service.setCredentials(username, password);
      // this.service.nextPage();
      this.showErrorMessage = false;
    },
      err => {
        this.showErrorMessage = true;
      });


    this.loginForm.reset();
  }

  register(): void {
    this.router.navigate(['/registration']);
  }
}
