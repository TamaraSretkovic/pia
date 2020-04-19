import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  password: string;
  cPassword: string;
  oldPassword: string;

  modal: boolean;
  notification: boolean;
  showPasswordErrorMessage: boolean;
  showPasswordPatternErrorMessage: boolean;
  showPasswordEmptyMessage: boolean;

  constructor(private service: ApiService) {
    this.cPassword = '';
    this.oldPassword = '';
    this.password = '';
  }

  ngOnInit(): void {
  }

  logout() {
    this.service.logOutUser();
  }

  changePassword() {
    this.showPasswordErrorMessage = false;
    this.showPasswordPatternErrorMessage = false;
    this.cPassword = '';
    this.oldPassword = '';
    this.password = '';
    this.modal = true;
  }

  change() {
    this.showPasswordErrorMessage = false;
    this.showPasswordPatternErrorMessage = false;
    this.showPasswordEmptyMessage = false;

    if (this.oldPassword === '') {
      this.showPasswordEmptyMessage = true;
      return;
    }
    if (this.password !== this.cPassword) {
      this.showPasswordErrorMessage = true;
      return;
    }

    const pattern = "(?=^.{7,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$";
    if (this.password.match(pattern)===null) {
      this.showPasswordPatternErrorMessage = true;
      return;
    }
    this.showPasswordErrorMessage = false;
    this.showPasswordPatternErrorMessage = false;

    this.service.changePassword(this.oldPassword, this.password).subscribe(data => {
      this.cancel();
      this.notification = true;
    }, err => {
      console.log(err);
    });
  }

  cancel() {
    this.showPasswordErrorMessage = false;
    this.showPasswordPatternErrorMessage = false;
    this.cPassword = '';
    this.password = '';
    this.modal = false;
  }
}
