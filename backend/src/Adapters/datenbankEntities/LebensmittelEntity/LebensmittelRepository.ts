import { Lebensmittel } from "kern-util";

export interface LebensmittelRepository {
    find(): Promise<Lebensmittel[]>;
    findOneByOrFail(id: number): Promise<Lebensmittel>;
    save(lebensmittel: Lebensmittel): Promise<Lebensmittel>;
    delete(id: number): Promise<void>;
  }