import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  HostBinding
} from '@angular/core';
import { FilterComponent } from './filter.component';
import { FormGroup, FormBuilder, ControlContainer } from '@angular/forms';

@Component({
  template: ''
})
export class FilterGroupComponent extends FilterComponent {
  constructor(protected formBuilder: FormBuilder) {
    super(formBuilder);
  }

  getFormProperties() {
    return {};
  }

  buildFormControl(): FormGroup {
    return this.formBuilder.group(this.getFormProperties());
  }
}
