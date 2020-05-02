import { Component, OnInit } from '@angular/core';
import { Nursery } from 'src/app/model/nursery.model';
import { ApiService } from 'src/app/services/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrls: ['./farmer.component.css']
})
export class FarmerComponent implements OnInit {

  nurserys: Array<Nursery>;

  newNusrery: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    width: new FormControl('', Validators.required),
    height: new FormControl('', Validators.required),
    place: new FormControl('', Validators.required)
  });

  showServerErrorMessage: boolean;
  modal: boolean;
  modalContent: string;
  modalTitle: string;


  constructor(private service: ApiService, private router: Router) {
    this.nurserys = new Array<Nursery>();
  }

  ngOnInit(): void {
    this.getNurserys();
  }

  getNurserys() {
    this.service.getNurserys(this.service.getId()).subscribe(data => {
      this.nurserys = [];
      data.forEach(element => {
        const nursery = new Nursery();
        nursery.id = element._id;
        nursery.name = element.name;
        nursery.temp = element.temp;
        nursery.water = element.water;
        nursery.capacity = element.width * element.height;
        let seedlings = 0;
        element.seedlings.forEach(seed => {
          if (seed.status === 'full') {
            seedlings++;
          }
        });
        nursery.seedlings = seedlings;
        this.nurserys.push(nursery);
      });
    });
  }

  open(nursery: Nursery) {
    this.router.navigate(['/nursery', nursery.id]);
  }

  addNursery() {
    this.showServerErrorMessage = false;

    if (this.newNusrery.invalid) {
      console.log('invalid');

      return;
    }

    const nursery = {
      id: this.service.getId(),
      name: this.newNusrery.value.name,
      place: this.newNusrery.value.place,
      width: this.newNusrery.value.width,
      height: this.newNusrery.value.height
    }

    this.service.addNursery(nursery).subscribe(res => {
      this.modalTitle = 'New Nursery';
      this.modalContent = res.message;
      this.modal = true;
      this.newNusrery.reset();

      this.getNurserys();
    }, err => {
      this.modalTitle = 'New Nursery';
      this.modalContent = err.message;
      this.modal = true;
    })
  }
}
