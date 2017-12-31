import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { cloneDeep, clone, get, keys, find, isEqual, difference, differenceWith, differenceBy } from 'lodash';
import { ObjectId } from 'mongodb';
import { TableService } from '../dbservice/table.service';

import { Subject } from 'rxjs/Subject';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-together',
  templateUrl: './together.component.html',
  styleUrls: ['./together.component.css']
})
export class TogetherComponent implements OnInit {
  modifications = { inserted: [], updated: [], deleted: [] };

  @Input() initialData: Promise<any>;
  @Input() meta: any;
  @Output() save = new EventEmitter<any>();

  @Input() isRoot: boolean;

  data: any[];
  columns: any;
  expanded = { row: undefined, column: undefined };

  displayedColumns = [];
  dataChange = new BehaviorSubject<any[]>([]);
  dataSource;

  selectedDocs = [];
  acValues = new Subject<string[]>();

  originalData;

  constructor(private tableService: TableService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.initialData = Promise.resolve(this.initialData);

    this.columns = this.meta.columns;

    this.columns.forEach(column => {
      this.displayedColumns.push(column.name);
    });

    this.dataSource = new MyDataSource(this.dataChange);
    this.initialData.then(res => {
      this.data = res;
      if (this.isRoot) {
        this.originalData = cloneDeep(this.data);
        this.convert(this.data, this.columns, true);
      }
      this.dataChange.next(this.data);
    });
  }

  convert(data: any, columns: any, dir?: boolean) {
    dir = (dir === undefined) ? true : dir;

    data.forEach(doc => {
      const fields = keys(doc);
      fields.forEach(field => {
        const col = find(columns, { name: field });
        if (col === undefined) {
          return;
        }
        switch (col['type']) {
          case 'addWithLimit':
            if (dir) {
              const limitField = col['limitField'];
              console.log('converted to add with limit');
              if (typeof doc[field] === 'number') {
                doc[field] = { initial: doc[field], added: 0, limitField: doc[limitField] };
              }
            } else {
              console.log('converted from add with limit');
              doc[field] = doc[field].initial + doc[field].added;
            }
            break;
          case 'table':
            this.convert(doc[field], col['meta']['columns'], dir);
            break;
          default:
            break;
        }
      });
    });
  }

  getCellStyle(column, j, i): object {
    if (column === 'select') {
      return { flexGrow: 0.17, flexShrink: 1 };
    }

    if (this.isExpanded(column, i)) {
      return { height: '0px', alignSelf: 'flex-start' };
    }

    return {};
  }

  addRow() {
    const inserted = {};
    this.data.push(inserted);
    this.dataChange.next(this.data);
  }

  deleteRow() {
    this.data = this.data.filter(item => this.selectedDocs.indexOf(item) < 0);

    this.selectedDocs = [];
    this.dataChange.next(this.data);
  }

  edit(event, column, row) {
    if (this.data[row][column] === undefined) {
      this.data[row][column] = this.getDefaultValue(column, row);
    }

    event.stopPropagation();
    this.setExpanded(column, row);
  }


  clickAway(event) {
    event.stopPropagation();

    this.expanded.row = undefined;
    this.expanded.column = undefined;
  }

  isExpanded(column, row) {
    if (this.expanded.column === column && this.expanded.row === row) {
      return true;
    }
    return false;
  }

  setExpanded(column, row) {
    this.expanded.column = column;
    this.expanded.row = row;
  }

  getDataAsPromise(column, i) {
    if (this.data[i][column] !== undefined) {
      return Promise.resolve(this.data[i][column]);
    } else {
      this.data[i][column] = [];
      return Promise.resolve(this.data[i][column]);
    }
  }

  selected(event, column, i) {
    if (event.checked) {
      this.selectedDocs.push(this.data[i]);
    } else {
      this.selectedDocs = this.selectedDocs.filter(doc => doc !== this.data[i]);
    }
  }

  getDefaultValue(column, row) {
    const col = find(this.columns, { name: column });

    switch (col['type']) {
      case 'addWithLimit':
        return { initial: 0, added: 0, limitField: this.data[row][col['limitField']] };
      default:
        break;
    }

    return undefined;
  }

  keyup(event, j) {
    this.acValues.next(this.meta.columns[j].acValues.filter(option => {
      if (option === undefined) {
        return false;
      }
      return option.toLowerCase().indexOf(event.toLowerCase()) === 0;
    }));
  }

  getAddWithColumn(element) {
    return element.initial + element.added + '/' + element.limitField;
  }


  saveChanges() {
    const modifications = this.getModifications();
    const mods = { mods: modifications, comp: this };
    this.save.emit(mods);
  }

  getModifications(): any {
    const modifiedData = cloneDeep(this.data);
    this.convert(modifiedData, this.columns, false);

    const deleted = differenceBy(this.originalData, modifiedData, '_id');
    const inserted = differenceBy(modifiedData, this.originalData, '_id');
    let updated = differenceWith(modifiedData, this.originalData, isEqual);
    updated = differenceWith(updated, inserted, isEqual);

    return { inserted: inserted, deleted: deleted, updated: updated };
  }

  async savedSuccessfully(res: Promise<any>) {
    res.then(response => {
      this.data = response;
      this.originalData = cloneDeep(this.data);
      this.convert(this.data, this.columns, true);
      this.dataChange.next(this.data);

      this.snackBar.open('Saved successfully', '', {
        duration: 2000,
      });
    });
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
