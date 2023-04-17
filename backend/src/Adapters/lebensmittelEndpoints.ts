import { Lebensmittel, LebensmittelBodyJSON, LebensmittelTyp } from "kern-util";
import { LebensmittelEntityManager } from "./datenbankEntities/LebensmittelEntity/lebensmittelEntityManager";
import { DatenbankLebensmittelRepository } from "./datenbankEntities/DatenbankLebensmittelRepository";

const lebensmittelEntityManager = LebensmittelEntityManager.getInstance(DatenbankLebensmittelRepository.getInstance())

export async function getLebensmittel(): Promise<LebensmittelBodyJSON[]> {
  const lebensmittelArr: LebensmittelBodyJSON[] = []
  const lebensmittelData = await lebensmittelEntityManager.getAll()

  lebensmittelData.forEach(lebensmittel => {
    lebensmittelArr.push(new Lebensmittel(lebensmittel.getId(), lebensmittel.name, lebensmittel.typ as LebensmittelTyp).createLebensmittelBodyJSON())
  })

  return lebensmittelArr
}