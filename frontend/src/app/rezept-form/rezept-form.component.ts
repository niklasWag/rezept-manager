import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Aufwand, Menge, MengenEinheit, Rezept, RezeptZutat, Zutat, ZutatBodyJSON, ZutatTyp } from 'kern-util';
import { map, Observable, of, startWith } from 'rxjs';
import { ZutatService } from '../services/zutat.service';

@Component({
  selector: 'app-rezept-form',
  templateUrl: './rezept-form.component.html',
  styleUrls: ['./rezept-form.component.css']
})
export class RezeptFormComponent {
  zutatNameFormControl = new FormControl('')
  zutatenData: ZutatBodyJSON[] = []
  zutaten: Zutat[] = []
  filteredZutaten: Observable<Zutat[]> = of(this.zutaten)
  zutatTypen: any[] = []
  mengenEinheiten: any[] = []
  name: string = ''
  aufwand: Aufwand = Aufwand.mittel
  rezeptZutaten: RezeptZutat[] = []
  tableData = new MatTableDataSource<RezeptZutat>()
  selection = new SelectionModel<RezeptZutat>(true, []);
  zutatName: string = ''
  zutatTyp: string = ''
  mengeWert: number = 0
  mengeEinheit: string = ''

  constructor(public dialogRef: MatDialogRef<RezeptFormComponent>, private readonly zutatService: ZutatService) {
    this.zutatService.getAll().subscribe({next: res => this.zutatenData = res, complete: () => this.createZutaten()})
    for (const val in MengenEinheit) {
      this.mengenEinheiten.push(val)
    }
    for (const val in ZutatTyp) {
      this.zutatTypen.push(val)
    }
  }

  createZutaten() {
    this.zutatenData.forEach(zutat => this.zutaten.push(new Zutat(zutat.id, zutat.name, zutat.typ)))
    this.filteredZutaten = this.zutatNameFormControl.valueChanges.pipe(
      startWith(''),
      map(zutat => (zutat ? this._filter(zutat) : this.zutaten.slice())),
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
    this.selection.selected.forEach(selectedZutat => {
      const index = this.rezeptZutaten.indexOf(selectedZutat)
      if (index != -1) {
        this.rezeptZutaten.splice(index, 1)
      }
    })
    this.tableData.data = this.rezeptZutaten
    this.selection.clear()
  }

  autocompleteSelected(event: MatAutocompleteSelectedEvent) {
    const zutat = event.option.value
    this.zutatName = zutat.name
    this.zutatTyp = zutat.typ
  }

  saveZutat() {
    if (!this.zutatName) {
      window.alert('Zutatname nicht gültig')
      return
    }
    if (!this.zutatTyp) {
      window.alert('Zutattyp nicht gültig')
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
    const rezeptZutat = new RezeptZutat(0, new Zutat(0, this.zutatName, this.zutatTyp as ZutatTyp), new Menge(this.mengeWert, this.mengeEinheit as MengenEinheit))
    this.rezeptZutaten.push(rezeptZutat)
    this.tableData.data = this.rezeptZutaten
  }

  abort() {
    this.dialogRef.close(false)
  }

  save() {
    if (!this.name) {
      window.alert('Name ist ungültig')
      return
    }
    const rezept = new Rezept(0, this.name, this.aufwand, this.rezeptZutaten)
    this.dialogRef.close(rezept)
  }

  private _filter(value: string): Zutat[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase()

      return this.zutaten.filter(zutat => zutat.name.toLowerCase().includes(filterValue))
    } else {
      return this.zutaten
    }
  }

}
