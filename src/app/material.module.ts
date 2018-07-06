import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatBadgeModule,
  MatAutocompleteModule,
  MatBottomSheetModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTabsModule,
  MatSortModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSliderModule,
  MatSlideToggleModule
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  exports: [
    MatButtonModule,
    MatBadgeModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTabsModule,
    MatSortModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatSlideToggleModule,
    FlexLayoutModule
  ]
})
export class MaterialModule {}
