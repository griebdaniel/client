import { Component, OnInit, ViewChild } from '@angular/core';
import { TableService } from '../dbservice/table.service';
import { get, set, keys } from 'lodash';
import { Router } from '@angular/router';

import 'rxjs/add/operator/startWith';
import { Subject } from 'rxjs/Subject';
import { MatDialog } from '@angular/material';
import { DialogContentComponent } from './dialog-content.component';
import { saveAs } from 'file-saver';


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
  machines: Promise<any>;
  machineNecessary: Promise<any>;
  price: Promise<any>;

  selectedProductOrder = '';

  user = { username: '', password: '' };

  selectedCollection = 'supplies';
  selectedGroup = 'static';

  acSupplies = [];
  acProducts = [];
  acMachines = [];
  acProductOrders = [];

  acValues = new Subject<string[]>();

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
      { name: 'price', type: 'number' },
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

  machinesMeta = {
    collectionName: 'Machines',
    columns: [
      { name: 'name', type: 'text' },
      { name: 'price', type: 'number' }
    ]
  };

  phasesMeta = {
    collectionName: 'Phases',
    columns: [
      { name: 'machineName', type: 'autocomplete', acValues: this.acMachines },
      { name: 'time', type: 'number' },
    ]
  };

  productsMeta = {
    collectionName: 'Products',
    columns: [
      { name: 'name', type: 'text' },
      { name: 'necessary', type: 'table', meta: this.supplyNecessaryMeta },
      { name: 'phases', type: 'table', meta: this.phasesMeta }
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

  neccearyMachinesPhaseListMeta = {
    collectionName: 'Machines',
    columns: [
      { name: 'name', type: 'text' },
      { name: 'qty', type: 'number' }
    ]
  };

  machineNecessaryMeta = {
    collectionName: 'MachineNecessary',
    columns: [
      { name: 'ordername', type: 'text' },
      { name: 'required', type: 'table', meta: this.neccearyMachinesPhaseListMeta }
    ]
  };

  priceMeta = {
    collectionName: 'Price',
    columns: [
      { name: 'ordername', type: 'text' },
      { name: 'supplyPrice', type: 'number' },
      { name: 'machinePrice', type: 'number' },
      { name: 'total', type: 'number' },
    ]
  };

  constructor(private router: Router, private tableService: TableService, public dialog: MatDialog) { }

  async ngOnInit() {
    this.supplies = this.tableService.find('supplies', {}, {});
    this.supplyOrders = this.tableService.find('supplyOrders', {}, {});
    this.products = this.tableService.find('products', {}, {});
    this.productOrders = this.tableService.find('productOrders', {}, {});
    this.machines = this.tableService.find('machines', {}, {});

    this.necessary = this.tableService.getNecessary();
    this.machineNecessary = this.tableService.getMachineNecessary();
    this.price = this.tableService.getPrice();

    this.price.then(res => { console.log(res); });

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

    this.machines.then(machines => {
      machines.forEach(element => {
        this.acMachines.push(element.name);
      });
    });

    this.productOrders.then(productOrders => {
      productOrders.forEach(productOrder => {
        this.acProductOrders.push(productOrder.name);
      });
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogContentComponent, {
      data: this.user
    });

    dialogRef.afterClosed().subscribe(result => {
      this.tableService.login(this.user.username, this.user.password).then(res => console.log(res));
    });
  }

  logout() {
    this.tableService.logout().then(res => { console.log(res); });
  }

  save(modifications) {
    console.log(this.selectedCollection);
    const mods = modifications.mods;
    const comp = modifications.comp;

    const updated = this.tableService.modify(this.selectedCollection, mods);
    comp.savedSuccessfully(updated);
  }

  // staticSelected() {
  //   this.selectedGroup = 'static';
  //   this.selectedCollection = 'supplies';
  //   this.sidenav.close();
  // }

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
          case 'Machines':
            this.selectedCollection = 'machines';
        }
        break;
    }
  }

  async getNecessaryAsCSV() {
    const csv = await this.tableService.getNecessaryAsCSV(this.selectedProductOrder);
    console.log('csv = ', csv);
    saveAs(new Blob([csv]), 'necessary.csv');
  }

  keyup() {
    this.acValues.next(this.acProductOrders.filter(option => {
      if (option === undefined) {
        return false;
      }
      return option.toLowerCase().indexOf(this.selectedProductOrder.toLowerCase()) === 0;
    }));
  }
}

export function replace(data, key, map) {
  data.forEach(element => {
    set(element, key, map.get(get(element, key)));
  });
}
