import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  form: FormGroup;

  products: any[];
  seedlings: any[];
  oRequests: any[];

  deleteModal: boolean;
  modal: boolean;
  modalTitle: string;
  modalContent: string;

  constructor(private formBuilder: FormBuilder, private service: ApiService) {
    this.form = this.formBuilder.group({
      name: this.formBuilder.group({
        name: ['', Validators.required],
        type: [, Validators.required]
      }),
      about: this.formBuilder.group({
        description: ['', Validators.required],
        time: [10, Validators.required]
      }),
      quantity: this.formBuilder.group({
        quantity: [1, Validators.required]
      }),
    });
    this.products = [];
    this.seedlings = [];
  }


  ngOnInit(): void {
    this.getOrders();
    this.getSeedlings();
    this.getProducts();
  }

  getOrders() {
    this.oRequests = [];
    this.service.getOrders(this.service.getId()).subscribe(data => {
      data.forEach(order => {
        this.oRequests.push(order);
      });
    }, err => {
      console.log(err);
    });
  }

  getSeedlings() {

  }

  getProducts(){

  }

  submit() {
    if (!this.form.valid) {
      console.log('nesto ne valja');
      return;
    }
    console.log('vuhu');

  }

  cancel() { }

  delete() { }

  info(product) { }

  acceptRequest(product) { }

  deleteRequest(product) { }
}
