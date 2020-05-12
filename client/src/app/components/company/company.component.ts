import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/helper.service';
import { Chart } from 'node_modules/chart.js';
import { fadeSlide } from '@clr/angular';

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

  chartData: any;
  chartLabels: any;
  chartOptions: any;
  chartLegend: boolean;
  chartType: string;

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

    this.chartOptions = {
      scaleShowVerticalLines: false,
      responsive: true
    };
    this.chartLegend = true;
    this.chartType = 'bar';
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
        } else if (order.status === 'important') {
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
    this.service.soldItemsPerDay().subscribe(data => {
      this.chartLabels = [];
      data.dates.forEach(date => {
        this.chartLabels.push((new Date(date)).toDateString());
      });
      this.chartData = [{data: data.items, label: 'Number of items sold inlast 30 days'}];
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

  acceptRequest(request) {
    console.log(request);
    
    this.service.acceptOrder(request._id).subscribe(ress => {
      this.modalTitle = 'Accept Order Request';
      this.modalContent = ress.message;
      this.modal = true;
      this.getOrders();
    }, err => {
      this.modalTitle = 'Accept Order Request';
      this.modalContent = err.message;
      this.modal = true;
    });
  }

  deleteRequest(request) {
    console.log(request);
    this.service.rejectOrder(request._id).subscribe(ress => {
      this.modalTitle = 'Reject Order Request';
      this.modalContent = ress.message;
      this.modal = true;
      this.getOrders();
    }, err => {
      this.modalTitle = 'Accept Order Request';
      this.modalContent = err.message;
      this.modal = true;
    });
  }
}
