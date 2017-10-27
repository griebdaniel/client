import { Directive, ElementRef, Input, OnInit, AfterContentInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Directive({ selector: '[appDynamicWidth]' })
export class DynamicWidthDirective implements OnInit, AfterContentInit, AfterViewInit, AfterViewChecked {

  @Input() column: string;
  @Input() widthChange: ReplaySubject<number>;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.widthChange.subscribe((leftPos) => {
      const myLeft = this.el.nativeElement.getBoundingClientRect().left;

      if (leftPos > myLeft) {
        let marginLeft: number = parseFloat(this.el.nativeElement.style.marginLeft);
        if (isNaN(marginLeft)) {
          marginLeft = 0;
        }

        this.el.nativeElement.style.marginLeft = marginLeft + (leftPos - myLeft) + 'px';
      }
    });
  }

  ngAfterViewChecked(): void {

    const rect = this.el.nativeElement.getBoundingClientRect();
    this.widthChange.next(rect.left);
  }

  ngAfterViewInit(): void {
    console.log(this.el.nativeElement.innerHTML.trim());
  }

  ngAfterContentInit(): void { }
}

