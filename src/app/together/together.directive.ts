import { Directive, OnInit, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';
import { TogetherComponent } from './together.component';
import { cloneDeep, isEqual, difference, differenceWith, differenceBy } from 'lodash';

@Directive({
  selector: '[appMods]',
})
export class TogetherDirective implements OnInit {
  @Output('save') save = new EventEmitter();

  private initialData: any;

  @HostListener('saveMods') onSave() {
    const modifications = this.getModifications();
    this.save.emit(modifications);
  }

  constructor(private el: ElementRef, private comp: TogetherComponent) {

  }

  ngOnInit(): void {
    this.comp.initialData.then((res) => {
      this.initialData = cloneDeep(res);
      this.convert(res, this.comp.types, true);
    });
  }

  convert(data: any, types: any, dir?: boolean) {
    dir = (dir === undefined) ? true : dir;

    data.forEach(doc => {
      for (const key in doc) {
        if (doc.hasOwnProperty(key)) {
          switch (types[key]) {
            case 'add':
              if (dir) {
                doc[key] = { initial: doc[key], added: 0 };
              } else {
                doc[key] = Number(doc[key].initial) + Number(doc[key].added);
              }
              break;
            default:
              if (typeof (types[key]) === 'object') {
                this.convert(data, types[key], dir);
              }
              break;
          }
        }
      }
    });
  }

  getModifications(): any {
    const modifiedData = cloneDeep(this.comp.data);
    this.convert(modifiedData, this.comp.types, false);

    const deleted = differenceBy(this.initialData, modifiedData, '_id');
    const inserted = differenceBy(modifiedData, this.initialData, '_id');
    let updated = differenceWith(modifiedData, this.initialData, isEqual);
    updated = differenceWith(updated, inserted, isEqual);

    console.log('deleted = ', deleted);
    console.log('inserted = ', inserted);
    console.log('updated = ', updated);

    return { inserted: inserted, deleted: deleted, updated: updated };
  }

}


