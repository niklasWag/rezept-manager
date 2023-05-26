import { LebensmittelBodyJSON } from "kern-util";
import { LebensmittelCRUD } from "../../Adapters/lebensmittelCRUD";
import { DatenbankLebensmittelRepository } from "../datenbankEntities/LebensmittelEntity/DatenbankLebensmittelRepository";

export class LebensmittelEndpoints {
    lebensmittelCRUD: LebensmittelCRUD;

    constructor(lebensmittelRepository: DatenbankLebensmittelRepository) {
        this.lebensmittelCRUD = new LebensmittelCRUD(lebensmittelRepository)
    }

    async getLebensmittel(): Promise<LebensmittelBodyJSON[]> {
        return await this.lebensmittelCRUD.getLebensmittel()
    }
}