import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Aufwand, Rezept, RezeptZutat } from 'kern-util';

@Component({
  selector: 'app-rezept-form',
  templateUrl: './rezept-form.component.html',
  styleUrls: ['./rezept-form.component.css']
})
export class RezeptFormComponent {
  name: string = ''
  aufwand: Aufwand = Aufwand.mittel
  rezeptZutaten: RezeptZutat[] = []

  constructor(public dialogRef: MatDialogRef<RezeptFormComponent>) {}

  abort() {
    this.dialogRef.close(false)
  }

  save() {
    const rezept = new Rezept(0, this.name, this.aufwand, [])
    this.dialogRef.close(rezept)
  }

}
