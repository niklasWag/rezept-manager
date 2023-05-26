import { Lebensmittel, LebensmittelBodyJSON, LebensmittelTyp } from "kern-util";
import { LebensmittelEntityManager } from "./EntityManager/lebensmittelEntityManager";
import { LebensmittelRecord } from "./Records/LebensmittelRecord";
import { Repository } from "./Repositorys/Repository";

export class LebensmittelCRUD {
  private lebensmittelEntityManager;

  constructor(lebensmittelRepository: Repository<LebensmittelRecord>){
    this.lebensmittelEntityManager = LebensmittelEntityManager.getInstance(lebensmittelRepository)
  }

  async getLebensmittel(): Promise<LebensmittelBodyJSON[]> {
    const lebensmittelArr: LebensmittelBodyJSON[] = []
    const lebensmittelData = await this.lebensmittelEntityManager.getAll()

    lebensmittelData.forEach(lebensmittel => {
      lebensmittelArr.push(new Lebensmittel(lebensmittel.id, lebensmittel.name, lebensmittel.typ as LebensmittelTyp).createLebensmittelBodyJSON())
    })

    return lebensmittelArr
  }
}

