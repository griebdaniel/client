import { Directive, Input, AfterViewInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMarginAlign]',
})
export class MarginAlignDirective implements AfterViewInit {
  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    this.alignMargins();
  }

  alignMargins() {
    const rows = this.el.nativeElement.querySelectorAll('mat-row');
    const headerRow = this.el.nativeElement.querySelector('mat-header-row');

    this.el.nativeElement.style.display = 'inline-flex';
    this.el.nativeElement.style.flexDirection = 'column';

    headerRow.style.alignSelf = 'flex-start';

    const headerCells = headerRow.querySelectorAll('mat-header-cell');
    const columns = [];
    headerCells.forEach(hCell => {
      columns.push([hCell]);
    });

    rows.forEach(row => {
      row.style.alignSelf = 'flex-start';
      const rowCells = row.querySelectorAll('mat-cell');

      rowCells.forEach((cell, index) => {
        columns[index].push(cell);
      });
    });

    columns.forEach((column, i) => {
      let max = 0;
      column.forEach((cell, j) => {
        // console.log('(' + i + ',' + j + ') = ' + cell.getBoundingClientRect().left);
        max = Math.max(cell.getBoundingClientRect().right, max);
      });
      column.forEach(cell => {
        // console.log('margin-left = ', cell.style.marginLeft);
        const marginRight: number =
          isNaN(parseFloat(cell.style.marginRight)) ? 0 : parseFloat(cell.style.marginRight);

        const rightPos = cell.getBoundingClientRect().right;
        cell.style.marginRight = marginRight + (max - rightPos) + 'px';
      });
    });

    const diff = this.el.nativeElement.offsetWidth - rows[0].offsetWidth;

    if (diff > 0) {
      columns.forEach((column, i) => {
        column.forEach(cell => {
          const marginRight: number =
            isNaN(parseFloat(cell.style.marginRight)) ? 0 : parseFloat(cell.style.marginRight);

          cell.style.marginRight = marginRight + diff / columns.length + 'px';
        });
      });
    }
  }
}
