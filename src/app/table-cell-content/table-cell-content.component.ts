import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { DataSource } from '@angular/cdk/table';

import 'rxjs/add/observable/of';

@Component({
  selector: 'app-table-cell-content',
  templateUrl: './table-cell-content.component.html',
  styleUrls: ['./table-cell-content.component.css']
})
export class TableCellContentComponent implements OnInit {
  @Input() show = true;

  isChecked = true;

  displayedColumns = ['col1', 'col2'];
  dataSource = new MyDataSource();

  cellContent = [];
  cellStyle = {};
  hCellContent = {};
  hCellStyle = {};

  constructor(private renderer2: Renderer2) {
    data.forEach((row, index) => {
      this.cellContent.push({});
    });

    this.hCellContent['select'] = 'checkbox';

    this.cellContent[0]['select'] = 'checkbox';
    this.cellContent[1]['select'] = 'checkbox';

    this.cellContent[0]['col1'] = 'input';
    this.cellContent[1]['col2'] = 'table';

    this.cellStyle['checkbox'] = { flexGrow: 0.1, flexShrink: 1 };
    this.cellStyle['input'] = { height: '0px', alignSelf: 'flex-start' };
    this.cellStyle['table'] = { height: '0px', alignSelf: 'flex-start' };
    this.hCellStyle['checkbox'] = this.cellStyle['checkbox'];
  }

  ngOnInit(): void { }

  tableClicked() {
    if (this.cellStyle['table'].flexBasis === '80%') {
      this.cellStyle['table'].flexBasis = '0%';
    } else {
      this.cellStyle['table'].flexBasis = '80%';
      this.cellStyle['table'].flexGrow = 1;
    }
  }
}

const data = [
  { col1: 'cell1', col2: 'cell2' },
  { col1: 'cell1', col2: 'cell2' },
];

export class MyDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return Observable.of(data);
  }

  disconnect() { }
}
