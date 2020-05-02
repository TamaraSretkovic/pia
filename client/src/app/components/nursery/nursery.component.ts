import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Nursery } from 'src/app/model/nursery.model';
import { Seedling } from 'src/app/model/seedling.model';
import { Product } from 'src/app/model/product.model';

@Component({
  selector: 'app-nursery',
  templateUrl: './nursery.component.html',
  styleUrls: ['./nursery.component.css']
})
export class NurseryComponent implements OnInit, OnDestroy {

  id: string;
  sub: any;

  nursery: Nursery;
  widthPlace: number;
  heightPlace: number;
  fetching: boolean;

  seedlings: Array<Seedling>;

  avilabileSeeds: Array<Seedling>;
  avilabileSuplements: Array<Product>;
  menagingSeedling: Seedling;
  updateSeed: boolean;
  transplantSeedModal: boolean;
  addSuplementModal: boolean;

  modal: boolean;
  modalContent: string;
  modalTitle: string;
  selectedSeed: string;
  selectedSuplement: string;

  constructor(private route: ActivatedRoute, private router: Router, private service: ApiService) {
    this.seedlings = new Array<Seedling>();
    this.fetching = true;
    this.nursery = new Nursery();
    this.avilabileSeeds = [{
      name: 'Drvo',
      producer: 'Company',
      progress: 0,
      status: 'full',
      fullTime: 20,
      quantity: 1,
      id: '0'
    },
    {
      name: 'Drvo',
      producer: 'Company',
      progress: 0,
      status: 'full',
      fullTime: 20,
      quantity: 1,
      id: '1'
    }];

    this.avilabileSuplements = [{
      name: 'Prasak',
      producer: 'Company',
      id: '0',
      power: 2,
      quantity: 1
    }, {
      name: 'Prasak2',
      producer: 'Company',
      id: '0',
      power: 5,
      quantity: 1
    }];
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getNursery()
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

    const oldSeedling = Object(this.menagingSeedling);
    this.avilabileSeeds.forEach(el => {
      if (this.selectedSeed === el.id) {
        this.menagingSeedling.name = el.name;
        this.menagingSeedling.producer = el.producer;
        this.menagingSeedling.fullTime = el.fullTime;
        this.menagingSeedling.progress = el.progress;
        this.menagingSeedling.quantity = el.quantity;
        this.menagingSeedling.status = el.status;
        // id od seedling ce biti index u nizu i nece se menjati radi lakse manipulacije
        this.service.updateSeedling(this.menagingSeedling, this.id).subscribe(res => {
          this.modalTitle = 'Seedling Addition';
          this.modalContent = res.message;
          this.modal = true;
        }, err => {
          this.menagingSeedling = oldSeedling;
          this.modalTitle = 'Seedling Addition';
          this.modalContent = err.message;
          this.modal = true;
        });

        // delete from warehouse
        this.avilabileSeeds.splice(i, 1);
        return;
      };
      i++;

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
      if (this.selectedSuplement === el.id) {
        this.menagingSeedling.progress = (this.menagingSeedling.progress + el.power) >= this.menagingSeedling.fullTime ? this.menagingSeedling.fullTime : this.menagingSeedling.progress + el.power;
        // id od seedling ce biti index u nizu i nece se menjati radi lakse manipulacije
        this.service.updateSeedling(this.menagingSeedling, this.id).subscribe(res => {
          this.modalTitle = 'Suplement Addition';
          this.modalContent = res.message;
          this.modal = true;
        }, err => {
          this.menagingSeedling = oldSeedling;
          this.modalTitle = 'Suplement Addition';
          this.modalContent = err.message;
          this.modal = true;
        });

        // delete from warehouse
        this.avilabileSuplements.splice(i, 1);
        return;
      };
      i++;

    })
    this.menagingSeedling = undefined;
  }

}
