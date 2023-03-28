import { Rezept, Zutat } from "kern-util";

export function rezeptSuchen(rezepte: Rezept[], rezeptFilter: RezeptFilter): Rezept[] {
  if (rezeptFilter.aufwand.length === 0 && rezeptFilter.zutatenIds.length === 0) return rezepte
  let filteredRezepte: Rezept[] = []
  if (rezeptFilter.zutatenIds.length > 0) {
    rezeptFilter.zutatenIds.forEach(zutatId => {
      rezepte.forEach(rezept => {
        rezept.rezeptZutaten.forEach(rezeptZutat => {
          if (rezeptZutat.getZutatId() === zutatId) {
            filteredRezepte.push(rezept)
            rezepte.splice(rezepte.indexOf(rezept), 1)
          }
        })
      })
    })
  } else {
    filteredRezepte = rezepte
  }
  if (rezeptFilter.aufwand.length > 0) {
    console.log(filteredRezepte)
    return filteredRezepte.filter(rezept => rezeptFilter.aufwand.includes(rezept.aufwand.toString()))
  }
  return filteredRezepte
}

export type RezeptFilter = {
  zutatenIds: number[],
  aufwand: string[]
}