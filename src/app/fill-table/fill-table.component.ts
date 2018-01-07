import { Component, OnInit, ViewChild } from '@angular/core';
import { TableService } from '../dbservice/table.service';
import { get, set, keys } from 'lodash';
import { Router } from '@angular/router';

import 'rxjs/add/operator/startWith';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-fill-table',
  templateUrl: './fill-table.component.html',
  styleUrls: ['./fill-table.component.css']
})
export class FillTableComponent implements OnInit {
  @ViewChild('sidenav') sidenav;

  supplies: Promise<any>;
  supplyOrders: Promise<any>;
  products: Promise<any>;
  productOrders: Promise<any>;
  necessary: Promise<any>;

  selectedCollection = 'supplies';
  selectedGroup = 'static';

  acSupplies = [];
  acProducts = [];
  suppliesMap = new Map<string, string>();

  attrsMeta = {
    collectionName: 'Attributes',
    columns: [
      { name: 'name', type: 'text' },
      { name: 'value', type: 'text' },
    ]
  };

  suppliesMeta = {
    collectionName: 'Supplies',
    columns: [
      { name: 'name', type: 'text' },
      { name: 'attrs', type: 'table', meta: this.attrsMeta }
    ]
  };

  orderListMeta = {
    collectionName: 'Supplies',
    columns: [
      {
        name: 'name', type: 'autocomplete', acValues: this.acSupplies
      },
      { name: 'qty', type: 'uom', uom: this.suppliesMap, refField: 'name' },
      // { name: 'qty', type: 'number' }
    ]
  };

  oredersMeta = {
    collectionName: 'Ordered supplies',
    columns: [
      { name: 'name', type: 'text' },
      { name: 'arrivalDate', type: 'date' },
      { name: 'supplies', type: 'table', meta: this.orderListMeta },
    ]
  };

  arrivedOrderListMeta = {
    collectionName: 'Supplies',
    columns: [
      {
        name: 'name', type: 'text', acValues: this.acSupplies
      },
      { name: 'arrived', type: 'addWithLimit', limitField: 'qty' }
    ]
  };

  arrivedOredersMeta = {
    collectionName: 'Arrived supplies',
    columns: [
      {
        name: 'name', type: 'text', acValues: this.acSupplies
      },
      { name: 'supplies', type: 'table', meta: this.arrivedOrderListMeta },
    ]
  };

  supplyNecessaryMeta = {
    collectionName: 'Supply necessary',
    columns: [
      { name: 'name', type: 'autocomplete', acValues: this.acSupplies },
      { name: 'qty', type: 'number' }
    ]
  };

  productsMeta = {
    collectionName: 'Products',
    columns: [
      { name: 'name', type: 'text' },
      { name: 'necessary', type: 'table', meta: this.supplyNecessaryMeta }
    ]
  };

  productOrderListMeta = {
    collectionName: 'Products',
    columns: [
      { name: 'name', type: 'autocomplete', acValues: this.acProducts },
      { name: 'qty', type: 'number' }
    ]
  };

  productOrdersMeta = {
    collectionName: 'Ordered products',
    columns: [
      { name: 'name', type: 'text' },
      { name: 'deadline', type: 'date' },
      { name: 'products', type: 'table', meta: this.productOrderListMeta }
    ]
  };

  finishedProductOrderListMeta = {
    collectionName: 'Products',
    columns: [
      { name: 'name', type: 'text' },
      { name: 'finished', type: 'addWithLimit', limitField: 'qty' }
    ]
  };

  finishedProductOrderMeta = {
    collectionName: 'Finished Products',
    columns: [
      { name: 'name', type: 'text' },
      { name: 'products', type: 'table', meta: this.finishedProductOrderListMeta }
    ]
  };

  inventoryMeta = {
    collectionName: 'Inventory',
    columns: [
      {
        name: 'name', type: 'autocomplete', acValues: this.acSupplies
      },
      { name: 'qty', type: 'uom', uom: this.suppliesMap, refField: 'name' }
    ]
  };

  necessarySupplyListMeta = {
    collectionName: 'Supplies',
    columns: [
      { name: 'name', type: 'text' },
      { name: 'qty', type: 'uom', uom: this.suppliesMap, refField: 'name' }
    ]
  };

  necessaryMeta = {
    collectionName: 'Necessary',
    columns: [
      { name: 'ordername', type: 'text' },
      { name: 'required', type: 'table', meta: this.necessarySupplyListMeta },
    ]
  };

  constructor(private router: Router, private tableService: TableService) { }

  async ngOnInit() {
    // const res = await this.tableService.isLoggedIn();

    // console.log(res);
    // if (res === 'false') {
    //   console.log('navigate to login');
    //   this.router.navigate(['/login']);
    //   return;
    // }

    this.supplies = this.tableService.find('supplies', {}, {});
    this.supplyOrders = this.tableService.find('supplyOrders', {}, {});
    this.products = this.tableService.find('products', {}, {});
    this.productOrders = this.tableService.find('productOrders', {}, {});

    this.necessary = this.tableService.getNecessary();

    this.supplies.then(supplies => {
      supplies.forEach(supply => {
        this.acSupplies.push(supply.name);
        if (supply.attrs !== undefined) {
          supply.attrs.forEach(elem => {
            if (elem.name === 'uom') {
              this.suppliesMap.set(supply.name, elem.value);
            }
          });
        }
      });
    });

    this.products.then(products => {
      products.forEach(product => {
        this.acProducts.push(product.name);
      });
    });
  }

  save(modifications) {
    const mods = modifications.mods;
    const comp = modifications.comp;

    const updated = this.tableService.modify(this.selectedCollection, mods);
    comp.savedSuccessfully(updated);
  }

  staticSelected() {
    this.selectedGroup = 'static';
    this.selectedCollection = 'supplies';
    this.sidenav.close();
  }

  tabChange(event) {
    switch (this.selectedGroup) {
      case 'static':
        switch (event.tab.textLabel) {
          case 'Supplies':
            this.selectedCollection = 'supplies';
            break;
          case 'Products':
            this.selectedCollection = 'products';
            break;
        }
        break;
    }

  }

}

export function replace(data, key, map) {
  data.forEach(element => {
    set(element, key, map.get(get(element, key)));
  });
}
