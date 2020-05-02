import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  form: FormGroup;
  products: any;
  oRequests: any;
  deleteModal: boolean;
  modal: boolean;
  modalTitle: string;
  modalContent: string;
  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: this.formBuilder.group({
        name: ['', Validators.required],
        type: [, Validators.required]
      }),
      about: this.formBuilder.group({
        description: ['', Validators.required]
      }),
      quantity: this.formBuilder.group({
        quantity: [1, Validators.required]
      }),
    });
    this.products = [];
    this.oRequests = []; 
  }


  ngOnInit(): void {
  }

  submit() {
    if (!this.form.valid) {
      console.log('nesto ne valja');
      return;
    }
    console.log('vuhu');
    
  }

  cancel(){}

  delete(){}

  info(product) {}

  acceptRequest(product){}

  deleteRequest(product){}
}
