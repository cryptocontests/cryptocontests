import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnInit
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { tap } from 'rxjs/operators';

@Component({
  template: ''
})
export class FilterComponent implements OnInit {
  @Input() title: string;
  @Input() name: string;
  @Output() valueChanges = new EventEmitter<any>();

  formGroup: FormGroup;
  value: any;

  constructor(protected formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formGroup = this.buildFormControl();
    console.log(this.formGroup);
    this.formGroup.valueChanges.pipe(tap(this.valueChanges.emit));
  }

  buildFormControl(): FormGroup {
    return this.formBuilder.group({ [this.name]: '' });
  }
}
