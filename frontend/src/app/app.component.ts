import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Rezept } from 'kern-util';
import { Menge, RezeptBodyJSON, Zutat, Lebensmittel, LebensmittelBodyJSON } from 'kern-util/lib/domain';
import { RezeptFormComponent } from './rezept-form/rezept-form.component';
import { RezeptService } from './services/rezept.service';
import { LebensmittelService } from './services/lebensmittel.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  rezepteData: RezeptBodyJSON[] = []
  lebensmittelData: LebensmittelBodyJSON[] = []
  rezepte: Rezept[] = []
  lebensmittel: Lebensmittel[] = []
  queryJSON = {}
  lebensmittelQuery: any[] = []
  aufwand: string[] = []

  constructor(private readonly rezeptService: RezeptService, private readonly lebensmittelService: LebensmittelService, public matDialog: MatDialog) {
    rezeptService.getAll().subscribe({next: res => this.rezepteData = res, complete: () => this.createRezepte()})
    lebensmittelService.getAll().subscribe({next: res => this.lebensmittelData = res, complete: () => this.createLebensmittel()})
  }

  createRezepte() {
    this.rezepte = []
    this.rezepteData.forEach(rezept => {
      //create RezeptZutaten
      const zutaten: Zutat[] = []
      rezept.zutaten.forEach(zutat => {
        zutaten.push(new Zutat(
          zutat.rezeptId,
          new Lebensmittel(zutat.lebensmittel.id, zutat.lebensmittel.name, zutat.lebensmittel.typ),
          new Menge(zutat.menge.wert, zutat.menge.einheit)))
      })
      zutaten.sort((a,b) => a.lebensmittel.name.localeCompare(b.lebensmittel.name))
      this.rezepte.push(new Rezept(rezept.id, rezept.name, rezept.aufwand, zutaten))
    })
    //sort alphabetically
    this.rezepte.sort((a,b) => a.name.localeCompare(b.name))
  }

  createLebensmittel() {
    this.lebensmittel = []
    this.lebensmittelData.forEach(lebensmittel => this.lebensmittel.push(new Lebensmittel(lebensmittel.id, lebensmittel.name, lebensmittel.typ)))
    this.lebensmittel.sort((a,b) => a.name.localeCompare(b.name))
  }

  buildQuery() {
    const filter = { lebensmittel: this.lebensmittelQuery, aufwand: this.aufwand}
    this.rezeptService.search(filter).subscribe({next: res => this.rezepteData = res, complete: () => this.createRezepte()})
  }

  openDialog() {
    const dialogRef = this.matDialog.open(RezeptFormComponent, {disableClose: true})
    dialogRef.afterClosed().subscribe({next: x => {
      if (x) {
        const body = (x as Rezept).createRezeptBodyJSON()
        this.rezeptService.post(body).subscribe({complete: () => {
          this.rezeptService.getAll().subscribe({next: res => this.rezepteData = res, complete: () => this.createRezepte()})
          this.lebensmittelService.getAll().subscribe({next: res => this.lebensmittelData = res, complete: () => this.createLebensmittel()})
        }})
      }
    }})
  }

  updateRezept(id: number) {
    const dialogRef = this.matDialog.open(RezeptFormComponent, {data: this.rezepte.find(rezept => rezept.getId() === id), disableClose: true})
    dialogRef.afterClosed().subscribe({next: x => {
      const body = (x as Rezept).createRezeptBodyJSON()
      this.rezeptService.put(body).subscribe({complete: () => {
        this.rezeptService.getAll().subscribe({next: res => this.rezepteData = res, complete: () => this.createRezepte()})
        this.lebensmittelService.getAll().subscribe({next: res => this.lebensmittelData = res, complete: () => this.createLebensmittel()})
      }})
    }})
  }

  deleteRezept(id: number) {
    console.log('delete', id)
    this.rezeptService.delete(id).subscribe({complete: () => {
      this.rezeptService.getAll().subscribe({next: res => this.rezepteData = res, complete: () => this.createRezepte()})
      this.lebensmittelService.getAll().subscribe({next: res => this.lebensmittelData = res, complete: () => this.createLebensmittel()})
    }})
  }
}
