import { Component, OnInit, ViewChild, AfterContentInit, AfterViewInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';



@Component({
  selector: 'app-many-row',
  templateUrl: './many-row.component.html',
  styleUrls: ['./many-row.component.css']
})
export class ManyRowComponent implements OnInit, AfterViewInit {
  @ViewChild('cell') cell;

  displayedColumns = [];
  dataSource: DataSource<any>;
  width = 0;

  widthChange = {};
  marginAlign = {};

  constructor() { }

  ngOnInit() {
    const columnCount = 4;
    const rowCount = 4;

    // let prev = new ReplaySubject<any>();
    // let next = new ReplaySubject<any>();

    for (let i = 0; i < columnCount; i++) {
      const colName = 'column' + i;
      this.displayedColumns.push(colName);
      this.widthChange[colName] = new ReplaySubject();

      // this.marginAlign[colName] = {};

      // this.marginAlign[colName]['maxReady'] = new ReplaySubject<any>();
      // this.marginAlign[colName]['previousColReady'] = prev;
      // this.marginAlign[colName]['nextColStart'] = next;
      // this.marginAlign[colName]['max'] = 0;

      // prev = next;
      // next = new ReplaySubject<any>();
    }


    // this.displayedColumns[0] += 'column1';

    for (let i = 0; i < rowCount; i++) {
      data.push({});
      for (const column of this.displayedColumns) {
        data[i][column] = 'row' + i;

        if (i === 0 && column === 'column0') {
          data[i][column] = 'aaa aaaaa aaaaaaa aa';
        } else if (i === 1 && column === 'column1') {
          data[i][column] = 'aaaaaaaaaaa';
        }
      }
    }

    // setTimeout(() => console.log(this.cell), 0);
    this.dataSource = new MyDataSource();


  }

  ngAfterViewInit(): void {
    console.log('many row');
  }
}



const data = [];

export class MyDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return Observable.of(data);
  }

  disconnect() { }
}
