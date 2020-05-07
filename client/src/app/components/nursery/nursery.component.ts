import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Nursery } from 'src/app/model/nursery.model';
import { Seedling } from 'src/app/model/seedling.model';
import { Product } from 'src/app/model/product.model';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-nursery',
  templateUrl: './nursery.component.html',
  styleUrls: ['./nursery.component.css']
})
export class NurseryComponent implements OnInit, OnDestroy {

  id: string;
  warehouseId: string;
  sub: any;

  nursery: Nursery;
  widthPlace: number;
  heightPlace: number;
  fetching: boolean;

  seedlings: Array<Seedling>;

  avilabileSeeds: Array<any>;
  avilabileSuplements: Array<any>;


  avilabileSeedsFiltered: Array<any>;
  avilabileSuplementsFiltered: Array<any>;

  orderRequests: Array<any>;

  menagingSeedling: Seedling;
  menagingOrder: Seedling;

  updateSeed: boolean;
  transplantSeedModal: boolean;
  addSuplementModal: boolean;

  modal: boolean;
  modalContent: string;
  modalTitle: string;
  selectedSeed: string;
  selectedSuplement: string;

  filter: string;

  private _filterName: string;
  get filterName(): string {
    return this._filterName;
  }
  set filterName(val: string) {
    this._filterName = val;
    if (this.filter.valueOf() === 'name') {
      this.filterByName();
    }
  }

  private _filterProducer: string;
  get filterProducer(): string {
    return this._filterProducer;
  }
  set filterProducer(val: string) {
    this._filterProducer = val;
    if (this.filter.valueOf() === 'producer') {
      this.filterByProducer();
    }
  }

  private _filterNumber: number;
  get filterNumber(): number {
    return this._filterNumber;
  }
  set filterNumber(val: number) {
    this._filterNumber = val;
    if (this.filter.valueOf() === 'quantity') {
      this.filterByQuantity();
    }
  }

  private _sort: string;
  get sort(): string {
    return this._sort;
  }
  set sort(val: string) {
    this._sort = val;

    switch (val) {
      case 'na':
        this.avilabileSeedsFiltered = this.helper.sortByNameAsc(this.avilabileSeeds);
        this.avilabileSuplementsFiltered = this.helper.sortByNameAsc(this.avilabileSuplements);
        break;
      case 'pa':
        this.avilabileSeedsFiltered = this.helper.sortByProducerAsc(this.avilabileSeeds);
        this.avilabileSuplementsFiltered = this.helper.sortByProducerAsc(this.avilabileSuplements);
        break;
      case 'qa':
        this.avilabileSeedsFiltered = this.helper.sortByNumberAsc(this.avilabileSeeds);
        this.avilabileSuplementsFiltered = this.helper.sortByNumberAsc(this.avilabileSuplements);
        break;
      case 'nd':
        this.avilabileSeedsFiltered = this.helper.sortByNameDesc(this.avilabileSeeds);
        this.avilabileSuplementsFiltered = this.helper.sortByNameDesc(this.avilabileSuplements);
        break;
      case 'pd':
        this.avilabileSeedsFiltered = this.helper.sortByProducerDesc(this.avilabileSeeds);
        this.avilabileSuplementsFiltered = this.helper.sortByProducerDesc(this.avilabileSuplements);
        break;
      case 'qd':
        this.avilabileSeedsFiltered = this.helper.sortByNumberDesc(this.avilabileSeeds);
        this.avilabileSuplementsFiltered = this.helper.sortByNumberDesc(this.avilabileSuplements);
        break;
      default:
        break;
    }
  }

  constructor(private route: ActivatedRoute, private router: Router, private service: ApiService, private helper: HelperService) {
    this.seedlings = new Array<Seedling>();
    this.fetching = true;
    this.nursery = new Nursery();
    this.filter = 'name';
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getNursery();
      this.getWarehouse();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getNursery() {
    this.fetching = true;
    this.service.getNursery(this.id).subscribe(data => {

      this.widthPlace = (530 / data.width) - 4 * data.width;
      this.heightPlace = (530 / data.height) - 4 * data.height;
      this.nursery.capacity = data.width * data.height;
      this.nursery.temp = data.temp;
      this.nursery.water = data.water;
      this.nursery.name = data.name;

      this.seedlings = [];
      let i = 0;
      data.seedlings.forEach(seed => {
        const seedling = {
          name: seed.name,
          producer: seed.producer,
          progress: seed.progress,
          fullTime: seed.fullTime,
          status: seed.status,
          quantity: 1,
          id: i.toString()
        }
        this.seedlings.push(seedling);
        i++;
      });
      this.fetching = false;
    });
  }

  getWarehouse() {
    this.service.getWarehouse(this.id).subscribe(data => {
      this.warehouseId = data._id;
      this.avilabileSuplements = [];
      this.avilabileSeeds = [];
      data.seedlings.forEach(seed => {
        this.avilabileSeeds.push(seed);
      });
      data.products.forEach(prod => {
        this.avilabileSuplements.push(prod);
      });
      this.avilabileSeedsFiltered = this.avilabileSeeds;
      this.avilabileSuplementsFiltered = this.avilabileSuplements;
      this.getOrderRequests();
    });
  }

  getOrderRequests() {
    this.service.getOrderRequests(this.warehouseId).subscribe(data => {
      this.orderRequests = [];
      data.forEach(request => {
        const order = {
          companyId: request.companyId,
          orderId: request._id,
          name: request.name,
          producer: request.producer,
          type: request.type,
          quantity: request.quantity,
          status: request.status
        }
        this.orderRequests.push(order);
      });
    });
  }

  updateWarehouse() {
    this.service.updateWarehouse(this.id, this.avilabileSeeds, this.avilabileSuplements).subscribe(res => {
      console.log(res.message);
    }, err => {
      console.log(err);
      this.modalTitle = 'Update warehouse';
      this.modalContent = err.message;
      this.modal = true;
    });
  }

  back() {
    this.router.navigate(['/farmer']);
  }

  saveChanges() {
    this.service.saveNurseryChanges(this.id, this.nursery.temp, this.nursery.water).subscribe(res => {
      this.modalTitle = 'Save changes';
      this.modalContent = res.message;
      this.modal = true;
    }, err => {
      this.modalTitle = 'Save changes';
      this.modalContent = err.message;
      this.modal = true;
    });
  }

  insertSeed(seed: Seedling) {
    this.menagingSeedling = seed;
    this.modalTitle = 'Add seedling';
    this.updateSeed = true;
  }

  cancel() {
    // za 3 modala
    this.updateSeed = false;
    this.transplantSeedModal = false;
    this.addSuplementModal = false;
    this.menagingSeedling = undefined;
    this.selectedSuplement = undefined;
  }

  add() {
    let i = 0;
    this.updateSeed = false;
    console.log('add');

    const oldSeedling = Object(this.menagingSeedling);
    console.log(this.avilabileSeeds);

    this.avilabileSeeds.forEach(el => {
      if (this.selectedSeed === el._id) {
        this.menagingSeedling.name = el.name;
        this.menagingSeedling.producer = el.producer;
        this.menagingSeedling.fullTime = el.fullTime;
        this.menagingSeedling.progress = el.progress;
        this.menagingSeedling.quantity = 1;
        this.menagingSeedling.status = el.status;
        const index = i;

        // id od seedling ce biti index u nizu i nece se menjati radi lakse manipulacije
        this.service.updateSeedling(this.menagingSeedling, this.id).subscribe(res => {
          el.quantity--;
          if (el.quantity === 0) {
            this.avilabileSeeds.splice(index, 1);
          }
          this.modalContent = res.message;
          this.service.updateWarehouse(this.id, this.avilabileSeeds, this.avilabileSuplements).subscribe(res => {
            this.modalTitle = 'Seedling Addition';
            this.modal = true;
          }, err => {
            this.menagingSeedling = oldSeedling;
            this.modalTitle = 'Update warehous';
            this.modalContent = err.message;
            this.modal = true;
          });
        }, err => {
          this.menagingSeedling = oldSeedling;
          this.modalTitle = 'Seedling Addition';
          this.modalContent = err.message;
          this.modal = true;
        });
        return;
      } else {
        i++;
      }
    })
    this.menagingSeedling = undefined;
  }

  menageSeed(seed: Seedling) {
    this.menagingSeedling = seed;
    if (seed.progress === seed.fullTime) {
      this.modalTitle = 'Take Out Seedling';
      this.modalContent = 'Plant is ready for transplantations. Are you sure you want to do it?';
      this.transplantSeedModal = true;
    } else {
      this.modalTitle = 'Add suplement';
      this.addSuplementModal = true;
    }
  }

  yes() {
    this.transplantSeedModal = false;

    const oldSeedling = Object(this.menagingSeedling);
    this.menagingSeedling.name = '';
    this.menagingSeedling.producer = '';
    this.menagingSeedling.fullTime = 0;
    this.menagingSeedling.progress = 0;
    this.menagingSeedling.quantity = 0;
    this.menagingSeedling.status = 'notReady';
    this.service.updateSeedling(this.menagingSeedling, this.id).subscribe(res => {
      this.modalTitle = 'Seedling Transplantation';
      this.modalContent = res.message;
      this.modal = true;
    }, err => {
      this.menagingSeedling = oldSeedling;
      this.modalTitle = 'Seedling Transplantation';
      this.modalContent = err.message;
      this.modal = true;
    });
  }

  addSuplement() {
    let i = 0;
    this.addSuplementModal = false;

    const oldSeedling = Object(this.menagingSeedling);
    this.avilabileSuplements.forEach(el => {
      if (this.selectedSuplement === el._id) {
        const index = i;
        this.menagingSeedling.progress = (this.menagingSeedling.progress + el.power) >= this.menagingSeedling.fullTime ? this.menagingSeedling.fullTime : this.menagingSeedling.progress + el.power;
        // id od seedling ce biti index u nizu i nece se menjati radi lakse manipulacije
        this.service.updateSeedling(this.menagingSeedling, this.id).subscribe(res => {
          el.quantity--;
          if (el.quantity === 0) {
            this.avilabileSuplements.splice(index, 1);
          }
          this.modalContent = res.message;
          this.service.updateWarehouse(this.id, this.avilabileSeeds, this.avilabileSuplements).subscribe(res => {
            this.modalTitle = 'Suplement Addition';
            this.modal = true;
          }, err => {
            this.menagingSeedling = oldSeedling;
            this.modalTitle = 'Update warehous';
            this.modalContent = err.message;
            this.modal = true;
          });
          this.modalTitle = 'Suplement Addition';
          this.modalContent = res.message;
          this.modal = true;
        }, err => {
          this.menagingSeedling = oldSeedling;
          this.modalTitle = 'Suplement Addition';
          this.modalContent = err.message;
          this.modal = true;
        });
        return;
      };
      i++;
    })
    this.menagingSeedling = undefined;
  }

  cancelOrder(order: any) {
    this.service.cancelOrderRequests(order.orderId).subscribe(ress => {
      this.modalTitle = 'Cancel Request';
      this.modalContent = ress.message;
      this.modal = true;
      this.getOrderRequests();
    }, err => {
      this.modalTitle = 'Cancel Request';
      this.modalContent = err.error.message;
      this.modal = true;
    })
  }

  filterByName() {
    this.avilabileSeedsFiltered = this.helper.filterByName(this.filterName, this.avilabileSeeds);
    this.avilabileSuplementsFiltered = this.helper.filterByName(this.filterName, this.avilabileSuplements);
  }

  filterByProducer() {
    this.avilabileSeedsFiltered = this.helper.filterByProducer(this.filterProducer, this.avilabileSeeds);
    this.avilabileSuplementsFiltered = this.helper.filterByProducer(this.filterProducer, this.avilabileSuplements);
  }

  filterByQuantity() {
    this.avilabileSeedsFiltered = this.helper.filterByNumber(this.filterNumber, this.avilabileSeeds);
    this.avilabileSuplementsFiltered = this.helper.filterByNumber(this.filterNumber, this.avilabileSuplements);
  }
}
