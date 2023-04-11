import { Lebensmittel, LebensmittelBodyJSON, LebensmittelTyp } from "kern-util";
import { LebensmittelEntityManager } from "./datenbankEntities/LebensmittelEntity/lebensmittelEntityManager";

const lebensmittelEntityManager = LebensmittelEntityManager.getInstance()

export async function getLebensmittel(): Promise<LebensmittelBodyJSON[]> {
  const lebensmittelArr: LebensmittelBodyJSON[] = []
  const lebensmittelData = await lebensmittelEntityManager.getAll()

  lebensmittelData.forEach(lebensmittel => {
    lebensmittelArr.push(new Lebensmittel(lebensmittel.id, lebensmittel.name, lebensmittel.typ as LebensmittelTyp).createLebensmittelBodyJSON())
  })

  return lebensmittelArr
}