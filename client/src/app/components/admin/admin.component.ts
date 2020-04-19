import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FarmerRequest, CompanyRequest, makeUserFromCompanyRequest, makeUserFromFarmerRequest, User } from '../../model/registration-request';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  fRequests: Array<FarmerRequest>;
  cRequests: Array<CompanyRequest>;

  fUsers: Array<FarmerRequest>;
  cUsers: Array<CompanyRequest>;

  fReuest: FarmerRequest;
  cReuest: CompanyRequest;
  editedUser: any;
  oldUser: any;
  deletingUser: any;

  modalTitle: string;
  modalContent: string;
  modal: boolean;
  deleteModal: boolean;

  constructor(private service: ApiService) {
    this.fRequests = new Array<FarmerRequest>();
    this.cRequests = new Array<CompanyRequest>();
    this.fUsers = new Array<FarmerRequest>();
    this.cUsers = new Array<CompanyRequest>();
  }

  ngOnInit(): void {
    this.getRegistrationRequests();
    this.getUsers();
  }

  getUsers() {
    this.fRequests = [];
    this.cRequests = [];
    this.service.getUsers().subscribe(data => {
      data.forEach(request => {
        if (request.userType === 'farmer') {
          this.fUsers.push({
            firstName: request.fullName.split(' ')[0],
            lastName: request.fullName.split(' ')[1],
            username: request.username,
            password: request.password,
            email: request.email,
            phone: request.phone,
            bPlace: request.place,
            date: request.date,
            id: request._id
          });
        } else if (request.userType === 'company') {
          this.cUsers.push({
            companyName: request.fullName,
            username: request.username,
            password: request.password,
            email: request.email,
            ePlace: request.place,
            date: request.date,
            id: request._id
          });
        }
      });
    });
  }

  getRegistrationRequests() {
    this.service.getRegistrationRequests().subscribe(data => {
      data.forEach(request => {
        if (request.userType === 'farmer') {
          this.fRequests.push({
            firstName: request.fullName.split(' ')[0],
            lastName: request.fullName.split(' ')[1],
            username: request.username,
            password: request.password,
            email: request.email,
            phone: request.phone,
            bPlace: request.place,
            date: request.date,
            id: request._id
          });
        } else {
          this.cRequests.push({
            companyName: request.fullName,
            username: request.username,
            password: request.password,
            email: request.email,
            ePlace: request.place,
            date: request.date,
            id: request._id
          });
        }
      });
    });
  }

  acceptFarmerRequest(request: any) {
    const user = makeUserFromFarmerRequest(request);
    this.service.registerUser(user).subscribe(res => {
      this.modalTitle = 'Register User';
      this.modalContent = res.message;
      this.modal = true;
      let index = 0;
      this.fRequests.forEach(element => {
        if (element.id === request.id) {
          this.fRequests.splice(index, 1);
          return;
        }
        index++;
      });
    });
  }

  acceptCompanyRequest(request: any) {
    const user = makeUserFromCompanyRequest(request);
    this.service.registerUser(user).subscribe(res => {
      this.modalTitle = 'Register User';
      this.modalContent = res.message;
      this.modal = true;
      let index = 0;
      this.cRequests.forEach(element => {
        if (element.id === request.id) {
          this.cRequests.splice(index, 1);
          return;
        }
        index++;
      });
    });
  }

  deleteRegistrationRequest(request: any) {
    this.service.deleteUserRegistrationRequest(request.id).subscribe(res => {
      this.modalTitle = 'Register User';
      this.modalContent = res.message;
      this.modal = true;
      let index = 0;
      this.fRequests.forEach(element => {
        if (element.id === request.id) {
          this.fRequests.splice(index, 1);
        }
        index++;
      });
      index = 0;
      this.cRequests.forEach(element => {
        if (element.id === request.id) {
          this.cRequests.splice(index, 1);
        }
        index++;
      });
    });
  }

  editUser(user: any) {
    this.editedUser = user;
    this.oldUser = Object.assign({}, user);
  }

  reject(user) {
    console.log('reject');
    user = this.oldUser;
    this.editedUser = null;
    this.oldUser = null;
  }

  apdateUser(user: any, userType: string) {
    let edited = new User();
    if (userType === 'farmer') {
      edited = makeUserFromFarmerRequest(user);
    } else {
      edited = makeUserFromCompanyRequest(user);
    }
    this.service.updateUser(edited).subscribe(res => {
      this.modalTitle = 'Edit User';
      this.modalContent = res.message;
      this.modal = true;

      this.editedUser = null;
      this.oldUser = null;
    }, err => {
      this.modalTitle = 'Edit User';
      this.modalContent = err.message;
      this.modal = true;
      this.reject(user);
    });
  }

  deleteUser(user: any){
    this.deletingUser = user;
    this.modalTitle = 'Delete User';
    this.modalContent = 'Are you sure you want to delete ' + user.username + '?';
    this.deleteModal = true;
  }
  
  delete(){
    this.deleteModal = false;
    this.service.deleteUser(this.deletingUser.id).subscribe(res => {
      this.modalTitle = 'Delete User';
      this.modalContent = res.message;
      this.modal = true;
      let index = 0;
      this.fUsers.forEach(element => {
        if (element.id === this.deletingUser.id) {
          this.fUsers.splice(index, 1);
        }
        index++;
      });
      index = 0;
      this.cUsers.forEach(element => {
        if (element.id === this.deletingUser.id) {
          this.cUsers.splice(index, 1);
        }
        index++;
      });
    }, err => {
      this.modalTitle = 'Delete User';
      this.modalContent = err.message;
      this.modal = true;
    });
  }

  cancel() {
    this.deleteModal = false;
    this.deletingUser = null;
  }
}
