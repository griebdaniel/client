import { Directive, Input, Output, EventEmitter, HostListener, ElementRef, OnInit } from '@angular/core';
import { TogetherComponent } from './together.component';

@Directive({
  selector: '[appAdd]',
})
export class AddDirective implements OnInit {
  @Input() value;
  @Output('onSave') onSave = new EventEmitter();

  @HostListener('change') onChange($event) {
    const value = this.el.nativeElement.value;
    this.onSave.emit(value);
  }

  constructor(private el: ElementRef, private comp: TogetherComponent) {
    console.log(this.comp['addedField']);
    this.comp['addedField'] = 'asd';
    console.log('constructed');
  }

  ngOnInit(): void {

  }

}
