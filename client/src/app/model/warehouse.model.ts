import { Seedling } from './seedling.model';
import { Product } from './product.model';

export class Warehouse {
    seedlings: Array<Seedling>;
    products: Array<Product>;
    waitingS: Array<Seedling>;
    waitingP: Array<Product>;

    sortByNameDec(){
        this.seedlings = this.seedlings.sort((s1, s2) => {
            if (s1.name > s2.name) { return 1; }
            if (s1.name < s2.name) { return -1; }
            return 0;
        });
        this.waitingS = this.waitingS.sort((s1, s2) => {
            if (s1.name > s2.name) { return 1; }
            if (s1.name < s2.name) { return -1; }
            return 0;
        });
        this.products = this.products.sort((s1, s2) => {
            if (s1.name > s2.name) { return 1; }
            if (s1.name < s2.name) { return -1; }
            return 0;
        });
        this.waitingP = this.waitingP.sort((s1, s2) => {
            if (s1.name > s2.name) { return 1; }
            if (s1.name < s2.name) { return -1; }
            return 0;
        });
    }

    sortByNameInc(){
        this.seedlings = this.seedlings.sort((s1, s2) => {
            if (s1.name > s2.name) { return -1; }
            if (s1.name < s2.name) { return 1; }
            return 0;
        });
        this.waitingS = this.waitingS.sort((s1, s2) => {
            if (s1.name > s2.name) { return -1; }
            if (s1.name < s2.name) { return 1; }
            return 0;
        });
        this.products = this.products.sort((s1, s2) => {
            if (s1.name > s2.name) { return -1; }
            if (s1.name < s2.name) { return 1; }
            return 0;
        });
        this.waitingP = this.waitingP.sort((s1, s2) => {
            if (s1.name > s2.name) { return -1; }
            if (s1.name < s2.name) { return 1; }
            return 0;
        });
    }

    sortByNumberDec(){
        this.seedlings = this.seedlings.sort((s1, s2) => {
            return s1.quantity - s2.quantity;
        });
        this.waitingS = this.waitingS.sort((s1, s2) => {
            return s1.quantity - s2.quantity;
        });
        this.products = this.products.sort((s1, s2) => {
            return s1.quantity - s2.quantity;
        });
        this.waitingP = this.waitingP.sort((s1, s2) => {
            return s1.quantity - s2.quantity;
        });
    }

    sortByNumberIncc(){
        this.seedlings = this.seedlings.sort((s1, s2) => {
            return s2.quantity - s1.quantity;
        });
        this.waitingS = this.waitingS.sort((s1, s2) => {
            return s2.quantity - s1.quantity;
        });
        this.products = this.products.sort((s1, s2) => {
            return s2.quantity - s1.quantity;
        });
        this.waitingP = this.waitingP.sort((s1, s2) => {
            return s2.quantity - s1.quantity;
        });
    }
}
