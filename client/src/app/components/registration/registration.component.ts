import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import {formatDate} from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  user: UserModel;

  constructor(private router: Router) { 
    this.user = {
      first: '',
      last: '',
      username: '',
      email: '',
      password: '',
      jmbg: '',
      date: new Date(),
      birtPlace: ''
    };
  }

  ngOnInit() {
  }

  checkUsername() {}

  checkEmail() {} 

  onSubmit() {
    console.log(this.user);
    this.checkUsername();
    this.checkEmail();
    this.router.navigate(['']);
  }

}
