import { Zutat, ZutatTyp } from "kern-util";
import { ZutatEntityManager } from "./datenbankEntities/ZutatEntity/zutatEntityManager";

const zutatEntityManager = ZutatEntityManager.getInstance()

export async function getZutaten(): Promise<Zutat[]> {
  const zutaten: Zutat[] = []
  const zutatData = await zutatEntityManager.getAll()

  zutatData.forEach(zutat => {
    zutaten.push(new Zutat(zutat.id, zutat.name, zutat.typ as ZutatTyp))
  })

  return zutaten
}