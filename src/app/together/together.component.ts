import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { cloneDeep, clone } from 'lodash';
import { ObjectId } from 'mongodb';
import { eval } from 'mathjs';
import { TableService } from '../dbservice/table.service';

@Component({
  selector: 'app-together',
  templateUrl: './together.component.html',
  styleUrls: ['./together.component.css']
})
export class TogetherComponent implements OnInit {
  modifications = { inserted: [], updated: [], deleted: [] };

  @Input() initialData: Promise<any>;
  @Input() types: any;
  @Output() saveMods = new EventEmitter<any>();

  data: any[];
  unmodifedData: any[];

  expanded = { row: undefined, column: undefined };
  beforeEdit: any;
  displayedColumns = [];
  dataChange = new BehaviorSubject<any[]>([]);
  dataSource;

  mods = [];

  modifiedDocs = [];
  selectedDocs = [];

  constructor(private tableService: TableService) {
  }

  ngOnInit() {
    this.initialData = Promise.resolve(this.initialData);

    this.types.select = 'checkbox';
    for (const key in this.types) {
      if (this.types.hasOwnProperty(key) && key !== 'select') {
        this.displayedColumns.push(key);
      }
    }

    this.dataSource = new MyDataSource(this.dataChange);
    this.initialData.then(res => {
      this.data = res;
      this.dataChange.next(this.data);
    });
  }

  getCellStyle(column, i): object {
    switch (this.types[column]) {
      case 'checkbox':
        return { flexGrow: 0.17, flexShrink: 1 };
      default:
        if (this.isExpanded(column, i)) {
          return { height: '0px', alignSelf: 'flex-start' };
        }
        break;
    }
    return {};
  }

  addToDelete(doc) {
    const docToDelete = cloneDeep(doc);

    this.displayedColumns.forEach(element => {
      if (element === 'select' || docToDelete[element] === undefined) {
        docToDelete[element] = { $exists: false };
      }
    });

    this.mods.push({ action: 'delete', filter: docToDelete });

    this.modifiedDocs.push({ action: 'delete', doc: docToDelete });

  }

  addRow() {
    const inserted = {};
    this.data.unshift(inserted);
    this.dataChange.next(this.data);
  }

  deleteRow() {
    this.data = this.data.filter(item => this.selectedDocs.indexOf(item) < 0);

    this.selectedDocs = [];
    this.dataChange.next(this.data);
  }

  updateCell() {
    if (this.expanded.row !== undefined && this.expanded.column !== undefined) {
      const col = this.expanded.column;
      const value = this.data[this.expanded.row][col];

      this.displayedColumns.forEach(element => {
        if (element === 'select' || this.beforeEdit[element] === undefined) {
          this.beforeEdit[element] = { $exists: false };
        }
      });

      const remove = ((o, key) => {
        o.forEach(element => {
          delete element[key];
        });
        for (const k in o) {
          if (o.hasOwnProperty(k) && Array.isArray(o[k])) {
            remove(o[k], key);
          }
        }
      });

      const valueSet = {};
      valueSet[col] = cloneDeep(value);

      if (Array.isArray(valueSet[col])) {
        remove(valueSet[col], 'select');
      }

      this.mods.push({
        action: 'update',
        filter: this.beforeEdit,
        valueSet: { $set: valueSet }
      });
    }
  }

  saveValue(column, i) { }

  saveChanges() {
    this.saveMods.emit();
  }

  edit(event, column, row) {
    if (this.data[row][column] === undefined) {
      this.data[row][column] = getDefaultValue(this.types[column]);
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

  convertData(data: any, dir?: boolean) {
    data.forEach(doc => {
      for (const key in doc) {
        if (doc.hasOwnProperty(key)) {
          switch (this.types[key]) {
            case 'add':
              if (dir) {
                doc[key] = { initial: doc[key], added: 0 };
              } else {
                doc[key] = Number(doc[key].initial) + Number(doc[key].added);
              }
              break;
            default:
              break;
          }
        }
      }
    });
  }

}

export function getDefaultValue (type) {
  switch (type) {
    case 'add':
      return { initial: 0, added: undefined };

    default:
      break;
  }

  return undefined;
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
