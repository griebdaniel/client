import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.css']
})
export class TableCardComponent implements OnInit {
  displayedColumns = ['name', 'qty'];
  dataSource = new MyDataSource();

  constructor() { }

  ngOnInit() { }
}

const data = [
  { name: 'supplyname', qty: 123 }
];

export class MyDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return Observable.of(data);
  }

  disconnect() { }
}
