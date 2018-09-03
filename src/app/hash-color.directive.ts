import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Md5 } from 'ts-md5';

@Directive({
  selector: '[hashColor]'
})
export class HashColorDirective implements OnInit {
  @Input('hashColor')
  hashColor: string;
  @Input()
  dark = true;

  constructor(protected elementRef: ElementRef) {}

  ngOnInit() {
    const hash = parseInt(<string>Md5.hashStr(this.hashColor), 16);
    const saturation = 50 + (hash % 50);
    const lightness = this.dark ? 35 + (hash % 10) : 60 + (hash % 30);

    this.elementRef.nativeElement.style.color =
      'hsl(' + (hash % 360) + ', ' + saturation + '%, ' + lightness + '%)';
  }
}
