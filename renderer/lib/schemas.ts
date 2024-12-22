import { z } from "zod";

export const wowClassSchema = z.enum([
  "DeathKnight",
  "DemonHunter",
  "Druid",
  "Evoker",
  "Hunter",
  "Mage",
  "Monk",
  "Paladin",
  "Priest",
  "Rogue",
  "Shaman",
  "Warlock",
  "Warrior",
]);
