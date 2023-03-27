import { Zutat, ZutatBodyJSON, ZutatTyp } from "kern-util";
import { ZutatEntityManager } from "./datenbankEntities/ZutatEntity/zutatEntityManager";

const zutatEntityManager = ZutatEntityManager.getInstance()

export async function getZutaten(): Promise<ZutatBodyJSON[]> {
  const zutaten: ZutatBodyJSON[] = []
  const zutatData = await zutatEntityManager.getAll()

  zutatData.forEach(zutat => {
    zutaten.push(new Zutat(zutat.id, zutat.name, zutat.typ as ZutatTyp).createZutatBodyJSON())
  })

  return zutaten
}