import { Component } from '@angular/core';
import { Rezept } from 'kern-util';
import { Menge, RezeptBodyJSON, RezeptZutat, Zutat } from 'kern-util/lib/domain';
import { RezeptService } from './services/rezept.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  rezepteData: RezeptBodyJSON[] = []
  rezepte: Rezept[] = []

  constructor(private readonly rezeptService: RezeptService) {
    rezeptService.getAll().subscribe({next: res => this.rezepteData = res, complete: () => this.createRezepte()})
  }

  createRezepte() {
    this.rezepteData.forEach(rezept => {
      //create RezeptZutaten
      const rezeptZutaten: RezeptZutat[] = []
      rezept.rezeptZutaten.forEach(rezeptZutat => {
        rezeptZutaten.push(new RezeptZutat(
          rezeptZutat.rezeptId,
          new Zutat(rezeptZutat.zutat.id, rezeptZutat.zutat.name, rezeptZutat.zutat.typ),
          new Menge(rezeptZutat.menge.wert, rezeptZutat.menge.einheit)))
      })
      this.rezepte.push(new Rezept(rezept.id, rezept.name, rezept.aufwand, rezeptZutaten))
    })
    //sort alphabetically
    this.rezepte.sort((a,b) => a.name.localeCompare(b.name))
  }
}
