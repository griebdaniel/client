import { Component, OnInit } from '@angular/core';
import { TableService } from '../dbservice/table.service';

@Component({
  selector: 'app-fill-table',
  templateUrl: './fill-table.component.html',
  styleUrls: ['./fill-table.component.css']
})
export class FillTableComponent implements OnInit {
  supplies: Promise<any>;
  supps: Promise<any>;

  suppliesTypes = { name: 'text', qty: 'add', attrs: { name: 'text', value: 'text' } };

  orders: Promise<any>;
  ordersTypes = { name: 'text', supplies: { name: 'text', qtyNeeded: 'text', qtyArrived: 'text' } };

  constructor(private tableService: TableService) { }

  ngOnInit() {
    this.supplies = this.tableService.find('supplies', {}, {});
  }

  save(mods) {
    console.log('save called');
    this.tableService.modify('supplies', mods);
  }
}
