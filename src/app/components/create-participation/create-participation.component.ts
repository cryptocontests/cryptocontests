import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FilePickerComponent } from '../file-picker/file-picker.component';
import { Participation } from '../../state/contest.model';

@Component({
  selector: 'cc-create-participation',
  templateUrl: './create-participation.component.html',
  styleUrls: ['./create-participation.component.css']
})
export class CreateParticipationComponent {
  participationForm: FormGroup;
  @ViewChild('filePicker') filePicker: FilePickerComponent;

  constructor(
    public dialogRef: MatDialogRef<CreateParticipationComponent>,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
  }

  private buildForm() {
    this.participationForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
  }


  cancel($event) {
    this.dialogRef.close();
  }

  createParticipation() {
    const participation: Participation = {
      title: this.participationForm.value.title,
      creator: null,
      date: null,
      content: {
        hash: null,
        content: new Buffer(this.filePicker.file.content)
      },
      votes: 0
    };
    this.dialogRef.close(participation);
  }

}
