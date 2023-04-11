import { Rezept } from "kern-util";

export function rezeptSuchen(rezepte: Rezept[], rezeptFilter: RezeptFilter): Rezept[] {
  const lokaleRezepte = [...rezepte]
  const usedRezeptIds: number[] = []
  if (rezeptFilter.aufwand.length === 0 && rezeptFilter.lebensmittelIds.length === 0) return rezepte
  let filteredRezepte: Rezept[] = []
  if (rezeptFilter.lebensmittelIds.length > 0) {
    rezeptFilter.lebensmittelIds.forEach(lebensmittelId => {
      lokaleRezepte.forEach(rezept => {
        rezept.zutaten.forEach(zutat => {
          if (zutat.getLebensmittelId() === lebensmittelId && !usedRezeptIds.includes(rezept.getId())) {
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
  lebensmittelIds: number[],
  aufwand: string[]
}