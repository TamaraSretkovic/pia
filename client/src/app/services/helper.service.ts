import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HelperService {
    constructor(){}

    filterByName(searchText: string, array: any[]): any[]{
        return array.filter(el => el.name.toLowerCase().indexOf(searchText.toLocaleLowerCase()) != -1);   
    }

    filterByProducer(searchText: string, array: any[]): any[]{
        return array.filter(el => el.producer.toLowerCase().indexOf(searchText.toLocaleLowerCase()) != -1);   
    }

    filterByNumber(searchNumber: number, array: any[]): any[]{
        return array.filter(el => el.quantity <= searchNumber)
    }

    sortByNameDesc(array: any[]): any[]{
        return array.sort((s1, s2) => {
            if (s1.name > s2.name) { return -1; }
            if (s1.name < s2.name) { return 1; }
            return 0;
        });
    }

    sortByProducerDesc(array: any[]): any[]{
        return array.sort((s1, s2) => {
            if (s1.producer > s2.producer) { return -1; }
            if (s1.producer < s2.producer) { return 1; }
            return 0;
        });
    }

    sortByNumberDesc(array: any[]): any[]{
        return array.sort((s1, s2) => {
            return s2.quantity - s1.quantity;
        });
    }

    sortByNameAsc(array: any[]): any[]{
        return array.sort((s1, s2) => {
            if (s1.name > s2.name) { return 1; }
            if (s1.name < s2.name) { return -1; }
            return 0;
        });
    }

    sortByProducerAsc(array: any[]): any[]{
        return array.sort((s1, s2) => {
            if (s1.producer > s2.producer) { return 1; }
            if (s1.producer < s2.producer) { return -1; }
            return 0;
        });
    }

    sortByNumberAsc(array: any[]): any[]{
        return array.sort((s1, s2) => {
            return s1.quantity - s2.quantity;
        });
    }
}