import { Component, OnInit } from '@angular/core';
import { CredentialsModel } from 'src/app/models/credentials.model';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  credentials: CredentialsModel;
  message: string;

  constructor(private router: Router, private api: ApiService) {
    this.message = '';
    this.credentials = {
      username: '',
      password: ''
    };
  }

  ngOnInit() {
  }

  register() {
    this.router.navigate(['registration']);
  }

  onSubmit() {
    this.api.login(this.credentials).subscribe(res => {
      console.log(res);
      // redirect to user
    },
      err => {
        console.log(err);
        this.message = 'Wrong credentials';
        this.credentials.password = '';
        this.credentials.username = '';
      });
  }

}
