import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'cc-cancel-candidature',
  templateUrl: './cancel-candidature.component.html',
  styleUrls: ['./cancel-candidature.component.css']
})
export class CancelCandidatureComponent implements OnInit {
  reason: string;

  constructor(public dialogRef: MatDialogRef<CancelCandidatureComponent>) {}

  ngOnInit() {}

  cancel($event) {
    this.dialogRef.close();
  }

  cancelCandidature() {
    this.dialogRef.close(this.reason);
  }
}
