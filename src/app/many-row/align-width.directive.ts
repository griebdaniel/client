import { Directive, Input, AfterViewInit, ElementRef, DoCheck } from '@angular/core';

@Directive({
  selector: '[appAlignWidth]',
})
export class AlignWidthDirective implements AfterViewInit {

  constructor(private el: ElementRef) {

  }

  ngAfterViewInit(): void {
    const headerRow = this.el.nativeElement.querySelector('mat-header-row');
    const headerCells = headerRow.querySelectorAll('mat-header-cell');

    console.log('asdf');

    console.log(headerCells[0].childNodes);

  }


}
