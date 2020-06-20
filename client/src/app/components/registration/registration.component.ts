import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  @Input() admin: boolean;

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
  modalContent: string;

  // rechaptcha: any;
  // notRobot: boolean;
  data: any;

  constructor(private service: ApiService, private router: Router) {
    // this.notRobot = false;
  }

  ngOnInit(): void {
  }

  // resolved(RechaptchaResponse: any){
  //   this.rechaptcha = RechaptchaResponse;
  //   console.log(this.rechaptcha);
  //   this.service.rechaptchaRequest(this.rechaptcha).subscribe(ress => {
  //     if(ress===true){
  //       this.notRobot = true;
  //     }
  //   })
  // }

  registerFarmer(): void {
    this.showPasswordErrorMessage = false;
    this.showErrorMessage = false;
    this.showServerErrorMessage = false;
    this.showPasswordPatternErrorMessage = false;

    if (this.registrationForm.invalid) {
      this.showErrorMessage = true;
      return;
    }
    if (this.registrationForm.value.password !== this.registrationForm.value.cPassword) {
      this.showPasswordErrorMessage = true;
      return;
    }

    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-z].[A-Za-z\d@$!%*?&]{6,}$/;

    if (this.registrationForm.value.password.match(pattern) === null) {
      this.showPasswordPatternErrorMessage = true;
      return;
    }
    this.showPasswordErrorMessage = false;
    this.showErrorMessage = false;
    this.showServerErrorMessage = false;
    this.showPasswordPatternErrorMessage = false;

    const farmer = {
      fullName: `${this.registrationForm.value.fName} ${this.registrationForm.value.lName}`,
      email: this.registrationForm.value.email,
      phone: this.registrationForm.value.phone,
      place: this.registrationForm.value.bPlace,
      date: this.registrationForm.value.date,
      username: this.registrationForm.value.username,
      password: this.registrationForm.value.password,
      userType: 'farmer'
    };

    if(this.admin){
      this.service.registerUser(farmer).subscribe(data => {
        this.modal = true;
        this.modalContent = data.message;
      },
        err => {
          this.showServerErrorMessage = true;
          this.modal = true;
          this.modalContent = err.message;
        });
      this.registrationForm.reset();
    } else {
    this.service.registerRequest(farmer).subscribe(data => {
      this.modal = true;
      this.modalContent = data.message;
    },
      err => {
        this.showServerErrorMessage = true;
        this.modal = true;
        this.modalContent = err.message;
      });
    this.registrationForm.reset();
  }
}

  registerCompany() {
    this.showPasswordErrorMessage = false;
    this.showErrorMessage = false;
    this.showServerErrorMessage = false;
    this.showPasswordPatternErrorMessage = false;

    if (this.registrationCompanyForm.invalid) {
      this.showErrorMessage = true;
      return;
    }
    if (this.registrationCompanyForm.value.password !== this.registrationCompanyForm.value.cPassword) {
      this.showPasswordErrorMessage = true;
      return;
    }

    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-z].[A-Za-z\d@$!%*?&]{6,}$/;

    if (this.registrationCompanyForm.value.password.match(pattern) === null) {
      this.showPasswordPatternErrorMessage = true;
      return;
    }
    this.showPasswordErrorMessage = false;
    this.showErrorMessage = false;
    this.showServerErrorMessage = false;
    this.showPasswordPatternErrorMessage = false;

    const company = {
      fullName: this.registrationCompanyForm.value.cName,
      email: this.registrationCompanyForm.value.email,
      place: this.registrationCompanyForm.value.ePlace,
      date: this.registrationCompanyForm.value.date,
      username: this.registrationCompanyForm.value.username,
      password: this.registrationCompanyForm.value.password,
      userType: 'company'
    };

    if(this.admin) {
      this.service.registerUser(company).subscribe(data => {
        this.modal = true;
        this.modalContent = data.message;
      },
        err => {
          this.showServerErrorMessage = true;
          this.modal = true;
          this.modalContent = err.message;
        });
      this.registrationForm.reset();
    } else {
    this.service.registerRequest(company).subscribe(data => {
      this.modal = true;
      this.modalContent = data.message;
    },
      err => {
        this.showServerErrorMessage = true;
        this.modal = true;
        this.modalContent = err.message;
      });
    this.registrationCompanyForm.reset();
  }}

  ok() {
    this.modal = false;
    if(!this.admin){
      this.router.navigate(['/']);
    }
  }

  login() {
    this.router.navigate(['/']);
  }
}
