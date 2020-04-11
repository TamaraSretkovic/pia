import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup = new FormGroup({
    fName: new FormControl('', Validators.required),
    lName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    bPlace: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    cPassword: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  registrationCompanyForm: FormGroup = new FormGroup({
    cName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    ePlace: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    cPassword: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  showPasswordErrorMessage: boolean;
  showServerErrorMessage: boolean;
  showErrorMessage: boolean;
  showPasswordPatternErrorMessage: boolean;
  modal: boolean;

  data: any;

  constructor(private service: ApiService, private router: Router) {
  }

  ngOnInit(): void {
  }

  registerFarmer(): void {
    if (this.registrationForm.invalid) {
      this.showErrorMessage = true;
      return;
    }
    if (this.registrationForm.value.password !== this.registrationForm.value.cPassword) {
      this.showPasswordErrorMessage = true;
      return;
    }
    const pattern = "(?=^.{7,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$";
    if (this.registrationForm.value.password.match(pattern)===null) {
      this.showPasswordPatternErrorMessage = true;
      return;
    }
    this.showPasswordErrorMessage = false;
    this.showErrorMessage = false;
    this.showServerErrorMessage = false;
    this.showPasswordPatternErrorMessage = false;


    this.service.registerFarmer({
      first_name: this.registrationForm.value.fName,
      last_name: this.registrationForm.value.lName,
      email: this.registrationForm.value.email,
      phone: this.registrationForm.value.phone,
      b_place: this.registrationForm.value.bPlace,
      date: this.registrationForm.value.date,
      username: this.registrationForm.value.username,
      password: this.registrationForm.value.password
    }).subscribe(data => {
      this.modal = true;
    },
      err => {
        this.showServerErrorMessage = true;
      });
    this.registrationForm.reset();
  }

  registerCompany() {
    if (this.registrationCompanyForm.invalid) {
      this.showErrorMessage = true;
      return;
    }
    if (this.registrationCompanyForm.value.password !== this.registrationCompanyForm.value.cPassword) {
      this.showPasswordErrorMessage = true;
      return;
    }
    const pattern = "(?=^.{7,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$";
    if (this.registrationCompanyForm.value.password.match(pattern)===null) {
      this.showPasswordPatternErrorMessage = true;
      return;
    }
    this.showPasswordErrorMessage = false;
    this.showErrorMessage = false;
    this.showServerErrorMessage = false;
    this.showPasswordPatternErrorMessage = false;


    this.service.registerCompany({
      company_name: this.registrationCompanyForm.value.cName,
      email: this.registrationCompanyForm.value.email,
      e_place: this.registrationCompanyForm.value.ePlace,
      date: this.registrationCompanyForm.value.date,
      username: this.registrationCompanyForm.value.username,
      password: this.registrationCompanyForm.value.password
    }).subscribe(data => {
      this.modal = true;
    },
      err => {
        this.showServerErrorMessage = true;
      });
    this.registrationForm.reset();
  }

  ok() {
    this.modal = false;
    this.router.navigate(['/']);
  }

  login() {
    this.router.navigate(['/']);
  }
}
