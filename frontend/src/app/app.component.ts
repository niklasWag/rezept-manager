import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Rezept } from 'kern-util';
import { Menge, RezeptBodyJSON, RezeptZutat, Zutat, ZutatBodyJSON } from 'kern-util/lib/domain';
import { RezeptFormComponent } from './rezept-form/rezept-form.component';
import { RezeptService } from './services/rezept.service';
import { ZutatService } from './services/zutat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  rezepteData: RezeptBodyJSON[] = []
  zutatenData: ZutatBodyJSON[] = []
  rezepte: Rezept[] = []
  zutaten: Zutat[] = []
  queryJSON = {}
  zutatenQuery: any[] = []
  aufwand: string[] = []

  constructor(private readonly rezeptService: RezeptService, private readonly zutatService: ZutatService, public matDialog: MatDialog) {
    rezeptService.getAll().subscribe({next: res => this.rezepteData = res, complete: () => this.createRezepte()})
    zutatService.getAll().subscribe({next: res => this.zutatenData = res, complete: () => this.createZutaten()})
  }

  createRezepte() {
    this.rezepte = []
    this.rezepteData.forEach(rezept => {
      //create RezeptZutaten
      const rezeptZutaten: RezeptZutat[] = []
      rezept.rezeptZutaten.forEach(rezeptZutat => {
        rezeptZutaten.push(new RezeptZutat(
          rezeptZutat.rezeptId,
          new Zutat(rezeptZutat.zutat.id, rezeptZutat.zutat.name, rezeptZutat.zutat.typ),
          new Menge(rezeptZutat.menge.wert, rezeptZutat.menge.einheit)))
      })
      rezeptZutaten.sort((a,b) => a.zutat.name.localeCompare(b.zutat.name))
      this.rezepte.push(new Rezept(rezept.id, rezept.name, rezept.aufwand, rezeptZutaten))
    })
    //sort alphabetically
    this.rezepte.sort((a,b) => a.name.localeCompare(b.name))
  }

  createZutaten() {
    this.zutaten = []
    this.zutatenData.forEach(zutat => this.zutaten.push(new Zutat(zutat.id, zutat.name, zutat.typ)))
    this.zutaten.sort((a,b) => a.name.localeCompare(b.name))
  }

  buildQuery() {
    const filter = { zutaten: this.zutatenQuery, aufwand: this.aufwand}
    this.rezeptService.search(filter).subscribe({next: res => this.rezepteData = res, complete: () => this.createRezepte()})
  }

  openDialog() {
    const dialogRef = this.matDialog.open(RezeptFormComponent, {disableClose: true})
    dialogRef.afterClosed().subscribe({next: x => {
      if (x) {
        const body = (x as Rezept).createRezeptBodyJSON()
        this.rezeptService.post(body).subscribe({complete: () => {
          this.rezeptService.getAll().subscribe({next: res => this.rezepteData = res, complete: () => this.createRezepte()})
          this.zutatService.getAll().subscribe({next: res => this.zutatenData = res, complete: () => this.createZutaten()})
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
        this.zutatService.getAll().subscribe({next: res => this.zutatenData = res, complete: () => this.createZutaten()})
      }})
    }})
  }

  deleteRezept(id: number) {
    console.log('delete', id)
    this.rezeptService.delete(id).subscribe({complete: () => {
      this.rezeptService.getAll().subscribe({next: res => this.rezepteData = res, complete: () => this.createRezepte()})
      this.zutatService.getAll().subscribe({next: res => this.zutatenData = res, complete: () => this.createZutaten()})
    }})
  }
}
