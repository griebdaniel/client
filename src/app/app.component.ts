import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { DataSource } from '@angular/cdk/table';

import 'rxjs/add/observable/of';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  displayedColumns = ['checkbox', 'name', 'qty'];
  displayedColumns2 = ['name', 'qty'];
  dataSource = new MyDataSource();

  ngOnInit(): void { }

  rowClicked() {
    console.log('row clicked');
  }

  inputClicked(event) {
    console.log('input clicked');
    // event.stopPropagation();
  }
}

const data = [
  {
    checkbox: false,
    name: 'A', qty: 1
  },
  { checkbox: false, name: 'A', qty: 1 },
];

export class MyDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return Observable.of(data);
  }

  disconnect() { }
}
