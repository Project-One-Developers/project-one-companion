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

export const wowRolesSchema = z.enum(["Tank", "Healer", "DPS"]);

export const droptimizerItemSchema = z.object({
  name: z.string(),
  dmg: z.number(),
});
export type DroptimizerItem = z.infer<typeof droptimizerItemSchema>;

export const simFightInfoSchema = z.object({
  fightStyle: z.string(),
  targets: z.number(),
  duration: z.number(),
});

export const droptimizerCsvSchema = z.object({
  name: z.string(),
  difficulty: z.string(),
  dmg: z.string(),
  upgrades: z.array(droptimizerItemSchema),
  simFightInfo: simFightInfoSchema,
});

export const characterSchema = z.object({
  name: z.string(),
  class: wowClassSchema,
  role: wowRolesSchema,
  droptimizer: z.array(droptimizerCsvSchema),
});

export const playerSchema = z.object({
  name: z.string(),
  main: characterSchema,
  alt: z.array(characterSchema),
});