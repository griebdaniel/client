import { Component, OnInit, Input } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TableService } from '../dbservice/table.service';

@Component({
  selector: 'app-table-editing',
  templateUrl: './table-editing.component.html',
  styleUrls: ['./table-editing.component.css']
})
export class TableEditingComponent implements OnInit {
  @Input() types = { select: 'checkbox', col1: 'text', col2: 'table' };
  @Input() data = [
    { select: false, col1: 'cell1', col2: 'cell2' },
    { select: false, col1: 'cell1', col2: 'cell2' },
  ];

  expanded: string;

  isChecked = true;

  displayedColumns = ['select', 'col1', 'col2'];
  dataSource;

  dataChange: BehaviorSubject<any[]>;

  constructor(private tableService: TableService) {
  }

  ngOnInit() {
    this.dataChange = new BehaviorSubject<any[]>(this.data);
    this.dataSource = new MyDataSource(this.dataChange);
    this.tableService.find('supplies', {}, {});
  }

  getCellStyle(column, i): object {
    switch (this.types[column]) {
      case 'text': case 'table':
        if (this.expanded === column + i) {
          return { height: '0px', alignSelf: 'flex-start' };
        }
        break;
      case 'checkbox':
        return { flexGrow: 0.17, flexShrink: 1 };
      default:
        break;
    }

    return {};
  }

  addRow() {
    this.data.unshift({ select: undefined, col1: undefined, col2: undefined });
    this.dataChange.next(this.data);
  }

  deleteRow() {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].select) {
        this.data.splice(i, 1);
        i--;
      }
    }
    this.dataChange.next(this.data);
  }
}



export class MyDataSource extends DataSource<any> {
  data: Observable<any[]>;

  constructor(data) {
    super();
    this.data = data;
  }

  connect(): Observable<any[]> {
    return this.data;
  }

  disconnect() { }
}
