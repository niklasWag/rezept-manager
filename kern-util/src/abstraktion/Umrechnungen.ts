import { MengenEinheit } from "./MengenEinheiten";

export function mengenNormalisieren(wert: number, einheit: MengenEinheit): number {
  if (einheit === MengenEinheit.g || einheit === MengenEinheit.ml || einheit === MengenEinheit.Stück) return wert
  return wert * 1000
}