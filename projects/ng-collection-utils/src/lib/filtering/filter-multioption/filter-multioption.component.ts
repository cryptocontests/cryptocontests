import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FilterGroupComponent } from '../filter-group.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { overlayAnimation } from '../../animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'filter-multioption',
  templateUrl: './filter-multioption.component.html',
  styleUrls: ['./filter-multioption.component.css']
})
export class FilterMultioptionComponent extends FilterGroupComponent implements OnInit, OnDestroy {
  dummyGroup: FormGroup;
  subscription: Subscription;

  @Input() options: string[];
  constructor(protected formBuilder: FormBuilder) {
    super(formBuilder);
  }

  ngOnInit() {
    super.ngOnInit();
    this.dummyGroup = this.formBuilder.group({ input: { value: '', disabled: true } });
    this.subscription = this.formGroup.valueChanges.subscribe(values =>
      this.value = Object.keys(values).filter(key => values[key]).join(', ')
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getFormProperties() {
    return this.options.reduce((obj, option) => ({ ...obj, [option]: '' }), {});
  }
}
