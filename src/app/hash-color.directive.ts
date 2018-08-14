import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';

@Directive({
  selector: '[hashColor]'
})
export class HashColorDirective implements OnInit {
  @Input('hashColor')
  hashColor: string;

  constructor(protected elementRef: ElementRef) {}

  ngOnInit() {
    const hash = Md5.hashStr(this.hashColor).slice(0, 6);
    this.elementRef.nativeElement.style.color = '#' + hash;
  }
}
