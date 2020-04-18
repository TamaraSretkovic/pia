import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FarmerRequest, CompanyRequest } from '../../model/registration-request';

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

  constructor(private service: ApiService) {
    this.fRequests = new Array<FarmerRequest>();
    this.cRequests = new Array<CompanyRequest>();
    this.fUsers = new Array<FarmerRequest>();
    this.cUsers = new Array<CompanyRequest>();
  }

  ngOnInit(): void {
    this.initLists();
  }

  initLists() {
    // this.service.getCompanyRequests().subscribe(data => {
    //   this.fRequests = [];
    //   data.forEach(r => {
    //     this.fRequests.push(r);
    //   });
    // }, err => console.log(err));

    // this.service.getFarmerRequests().subscribe(data => {
    //   this.cRequests = [];
    //   data.forEach(r => {
    //     this.cRequests.push(r);
    //   });
    // }, err => console.log(err));

    // this.service.getCompanyUsers().subscribe(data => {
    //     this.fUsers = [];
    //     data.forEach(u => {
    //       this.fUsers.push(u);
    //     });
    //   }, err => console.log(err));

    // this.service.getFarmerUsers().subscribe(data => {
    //   this.cUsers = [];
    //   data.forEach(u => {
    //     this.cUsers.push(u);
    //   });
    // }, err => console.log(err));

    this.fRequests.push({
      firstName: 'Ime',
      lastName: 'Prezime',
      username: 'username',
      email: 'imejt@nesto',
      phone: '2222222222',
      bPlace: 'Lazarevac',
      date: '15/6/1977',
      id: 1
    });

    this.fRequests.push({
      firstName: 'Ime2',
      lastName: 'Prezime2',
      username: 'username2',
      email: 'imejt@nesto',
      phone: '2222222222',
      bPlace: 'Lazarevac',
      date: '15/6/1977',
      id: 2
    });

    this.cRequests.push({
      companyName: 'Prezime',
      username: 'username',
      email: 'imejt@nesto',
      ePlace: 'Lazarevac',
      date: '15/6/1977',
      id: 3
    });

    this.cRequests.push({
      companyName: 'Prezime2',
      username: 'username2',
      email: 'imejt@nesto',
      ePlace: 'Lazarevac',
      date: '15/6/1977',
      id: 4
    });
  }

  acceptFarmer(request: FarmerRequest, accept: boolean) {
    this.service.acceptFarmerRequests(accept, request.id).subscribe(data => {
      if(accept === true) {
        this.fUsers.push(data.user);
      }
      const index = this.fRequests.findIndex(r => r.id === request.id); // find index in your array
      this.fRequests.splice(index, 1); // remove element from array
    }, err => console.log(err)
    );
  }

  acceptCompany(request: CompanyRequest, accept: boolean) {
    this.service.acceptCompanyRequests(accept, request.id).subscribe(data => {
      if(accept === true) {
        this.cUsers.push(data.user);
      }
      const index = this.cRequests.findIndex(r => r.id === request.id); // find index in your array
      this.cRequests.splice(index, 1); // remove element from array
    }, err => console.log(err)
    );
  }
}
