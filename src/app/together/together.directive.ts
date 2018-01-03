import { Directive, OnInit, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';
import { TogetherComponent } from './together.component';
import { cloneDeep, isEqual, difference, differenceWith, differenceBy, find, keys } from 'lodash';

@Directive({
  selector: '[appMods]',
})
export class TogetherDirective implements OnInit {
  @Output('save') save = new EventEmitter();

  private initialData: any;

  @HostListener('saveMods') onSave() {
    const modifications = this.getModifications();
    const mods = { mods: modifications, comp: this.comp };
    this.save.emit(mods);
  }

  @HostListener('reload') onReload(data) {
    this.initialData = cloneDeep(data);
    this.convert(data, this.comp.columns, true);
  }

  constructor(private el: ElementRef, private comp: TogetherComponent) { }

  ngOnInit(): void {
    this.comp.initialData.then((res) => {
      this.initialData = cloneDeep(res);
      this.convert(res, this.comp.columns, true);
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
              doc[field] = { initial: doc[field], added: 0, limitField: doc[limitField] };
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

  getModifications(): any {
    const modifiedData = cloneDeep(this.comp.data);
    this.convert(modifiedData, this.comp.columns, false);

    const deleted = differenceBy(this.initialData, modifiedData, '_id');
    const inserted = differenceBy(modifiedData, this.initialData, '_id');
    let updated = differenceWith(modifiedData, this.initialData, isEqual);
    updated = differenceWith(updated, inserted, isEqual);

    return { inserted: inserted, deleted: deleted, updated: updated };
  }

}
