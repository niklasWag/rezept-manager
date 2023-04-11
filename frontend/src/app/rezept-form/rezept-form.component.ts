import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Aufwand, Menge, MengenEinheit, Rezept, Zutat, Lebensmittel, LebensmittelBodyJSON, LebensmittelTyp } from 'kern-util';
import { map, Observable, of, startWith } from 'rxjs';
import { LebensmittelService } from '../services/lebensmittel.service';

@Component({
  selector: 'app-rezept-form',
  templateUrl: './rezept-form.component.html',
  styleUrls: ['./rezept-form.component.css']
})
export class RezeptFormComponent {
  id: number = 0
  lebensmittelNameFormControl = new FormControl('')
  lebensmittelData: LebensmittelBodyJSON[] = []
  lebensmittel: Lebensmittel[] = []
  filteredLebensmittel: Observable<Lebensmittel[]> = of(this.lebensmittel)
  lebensmittelTypen: any[] = []
  mengenEinheiten: any[] = []
  name: string = ''
  aufwand: Aufwand = Aufwand.mittel
  zutaten: Zutat[] = []
  tableData = new MatTableDataSource<Zutat>()
  selection = new SelectionModel<Zutat>(true, []);
  lebensmittelName: string = ''
  lebensmittelTyp: string = ''
  mengeWert: number = 0
  mengeEinheit: string = ''

  constructor(public dialogRef: MatDialogRef<RezeptFormComponent>, private readonly lebensmittelService: LebensmittelService, @Inject(MAT_DIALOG_DATA) public data?: Rezept) {
    this.lebensmittelService.getAll().subscribe({next: res => this.lebensmittelData = res, complete: () => this.createLebensmittel()})
    for (const val in MengenEinheit) {
      this.mengenEinheiten.push(val)
    }
    for (const val in LebensmittelTyp) {
      this.lebensmittelTypen.push(val)
    }
    if (this.data) {
      this.id = this.data.getId()
      this.name = this.data.name
      this.aufwand = this.data.aufwand
      this.zutaten = this.data.zutaten
      this.tableData.data = this.zutaten
    }
  }

  createLebensmittel() {
    this.lebensmittelData.forEach(lebensmittel => this.lebensmittel.push(new Lebensmittel(lebensmittel.id, lebensmittel.name, lebensmittel.typ)))
    this.filteredLebensmittel = this.lebensmittelNameFormControl.valueChanges.pipe(
      startWith(''),
      map(lebensmittel => (lebensmittel ? this._filter(lebensmittel) : this.lebensmittel.slice())),
    )
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableData.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.tableData.data);
  }

  deleteZutat() {
    this.selection.selected.forEach(selectedLebensmittel => {
      const index = this.zutaten.indexOf(selectedLebensmittel)
      if (index != -1) {
        this.zutaten.splice(index, 1)
      }
    })
    this.tableData.data = this.zutaten
    this.selection.clear()
  }

  autocompleteSelected(event: MatAutocompleteSelectedEvent) {
    const lebensmittel = event.option.value
    this.lebensmittelName = lebensmittel.name
    this.lebensmittelTyp = lebensmittel.typ
  }

  saveLebensmittel() {
    if (!this.lebensmittelName) {
      window.alert('Lebensmittelname nicht gültig')
      return
    }
    if (!this.lebensmittelTyp) {
      window.alert('Lebensmiteltyp nicht gültig')
      return
    }
    if (!this.mengeWert || this.mengeWert <= 0) {
      window.alert('Wert der Menge ungültig')
      return
    }
    if (!this.mengeEinheit) {
      window.alert('Mengeneinheit ungültig')
      return
    }
    const zutat = new Zutat(this.id, new Lebensmittel(0, this.lebensmittelName, this.lebensmittelTyp as LebensmittelTyp), new Menge(this.mengeWert, this.mengeEinheit as MengenEinheit))
    this.zutaten.push(zutat)
    this.tableData.data = this.zutaten
    this.lebensmittelNameFormControl.setValue('')
    this.lebensmittelTyp = ''
    this.mengeWert = 0
    this.mengeEinheit = ''
  }

  abort() {
    this.dialogRef.close(false)
  }

  save() {
    if (!this.name) {
      window.alert('Name ist ungültig')
      return
    }
    const rezept = new Rezept(this.id, this.name, this.aufwand, this.zutaten)
    this.dialogRef.close(rezept)
  }

  private _filter(value: string): Lebensmittel[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase()

      return this.lebensmittel.filter(lebensmittel => lebensmittel.name.toLowerCase().includes(filterValue))
    } else {
      return this.lebensmittel
    }
  }

}
