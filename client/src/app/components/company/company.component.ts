import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/helper.service';
import { Chart } from 'node_modules/chart.js';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  form: FormGroup;
  type: string;

  products: any[];
  oRequests: any[];
  iRequests: any[];

  oRequestsSorted: any[];
  iRequestsSorted: any[];


  deletingProduct: any;
  deleteModal: boolean;
  modal: boolean;
  modalTitle: string;
  modalContent: string;


  private _sort: string;
  get sort(): string {
    return this._sort;
  }
  set sort(val: string) {
    this._sort = val;
    switch (val) {
      case 'asc':
        this.oRequestsSorted = this.helper.sortByDateAsc(this.oRequests);
        this.iRequestsSorted = this.helper.sortByDateAsc(this.iRequests);
        break;
      case 'dsc':
        this.oRequestsSorted = this.helper.sortByDateDesc(this.oRequests);
        this.iRequestsSorted = this.helper.sortByDateDesc(this.iRequests);
        break;
    }
  }


  constructor(private formBuilder: FormBuilder, private service: ApiService, private helper: HelperService) {
    this.form = this.formBuilder.group({
      name: this.formBuilder.group({
        name: ['', Validators.required],
        type: [, Validators.required]
      }),
      about: this.formBuilder.group({
        description: ['', Validators.required],
        power: [10, Validators.required]
      }),
      quantity: this.formBuilder.group({
        quantity: [1, Validators.required],
        price: [1, Validators.required]
      }),
    });
    this.products = [];
    this.oRequests = [];
    this.iRequests = [];
  }


  ngOnInit(): void {
    this.getOrders();
    this.getProducts();
    this.getResults();
  }

  getOrders() {
    this.oRequests = [];
    this.iRequests = [];
    this.service.getOrders(this.service.getId()).subscribe(data => {
      data.forEach(order => {
        if (order.status === 'pending') { // sta ces sa ovim statusima?
          this.oRequests.push(order);
        } else {
          this.iRequests.push(order);
        }
      });
      this.oRequestsSorted = this.oRequests;
      this.iRequestsSorted = this.iRequests;
    }, err => {
      console.log(err);
    });
  }


  getProducts() {
    this.products = [];
    this.service.getProducts(this.service.getId()).subscribe(data => {
      data.forEach(product => {
        this.products.push(product);
      });
    }, err => {
      console.log(err);
    });
  }

  getResults() {
    var myChart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  cancel() {
    this.deletingProduct = undefined;
  }

  delete(product) {
    this.deletingProduct = product;
    this.modalTitle = 'Delete Product';
    this.modalContent = 'Are you sure you want to delete product?';
    this.deleteModal = true;
  }

  info(product) { }


  addProduct() {
    if (!this.form.valid) {
      console.log('nesto ne valja');
      return;
    }
    const productInfo = {
      name: this.form.value.name.name,
      quantity: this.form.value.quantity.quantity,
      type: this.form.value.name.type,
      price: this.form.value.quantity.price,
      power: this.form.value.about.power,
      description: this.form.value.about.description
    }
    console.log(productInfo);

    this.service.addProduct(productInfo).subscribe(ress => {
      this.modalTitle = 'Add Product';
      this.modalContent = ress.message;
      this.modal = true;
      this.form.reset();
      this.getProducts();
    }, err => {
      this.modalTitle = 'Add Product';
      this.modalContent = err.error.message;
      this.modal = true;
    });

  }

  updateProduct(product) {
    this.service.updateProduct(product._id, product.description, product.quantity, product.price).subscribe(ress => {
      this.modalTitle = 'Update Product';
      this.modalContent = ress.message;
      this.modal = true;
    }, err => {
      this.modalTitle = 'Uprdate Product';
      this.modalContent = err.error.message;
      this.modal = true;
    });

  }

  deleteProduct() {
    this.service.deleteProduct(this.deletingProduct._id).subscribe(ress => {
      this.modalTitle = 'Delete Product';
      this.modalContent = ress.message;
      this.modal = true;
      this.getProducts();
    }, err => {
      this.modalTitle = 'Delete Product';
      this.modalContent = err.error.message;
      this.modal = true;
    });
  }

  acceptRequest(product) { }

  deleteRequest(product) { }
}
