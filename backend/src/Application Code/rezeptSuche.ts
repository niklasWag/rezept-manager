import { Rezept } from "kern-util";

export function rezeptSuchen(rezepte: Rezept[], rezeptFilter: RezeptFilter): Rezept[] {
  const lokaleRezepte = [...rezepte]
  const usedRezeptIds: number[] = []
  if (rezeptFilter.aufwand.length === 0 && rezeptFilter.zutatenIds.length === 0) return rezepte
  let filteredRezepte: Rezept[] = []
  if (rezeptFilter.zutatenIds.length > 0) {
    rezeptFilter.zutatenIds.forEach(zutatId => {
      lokaleRezepte.forEach(rezept => {
        rezept.rezeptZutaten.forEach(rezeptZutat => {
          if (rezeptZutat.getZutatId() === zutatId && !usedRezeptIds.includes(rezept.getId())) {
            filteredRezepte.push(rezept)
            usedRezeptIds.push(rezept.getId())
          }
        })
      })
    })
  } else {
    filteredRezepte = lokaleRezepte
  }
  if (rezeptFilter.aufwand.length > 0) {
    return filteredRezepte.filter(rezept => rezeptFilter.aufwand.includes(rezept.aufwand.toString()))
  }
  return filteredRezepte
}

export type RezeptFilter = {
  zutatenIds: number[],
  aufwand: string[]
}