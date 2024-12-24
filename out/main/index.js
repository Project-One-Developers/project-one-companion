"use strict";
const utils = require("@electron-toolkit/utils");
const electron = require("electron");
const path = require("path");
const drizzleOrm = require("drizzle-orm");
const zod = require("zod");
const uuid = require("uuid");
const nodePostgres = require("drizzle-orm/node-postgres");
const pgCore = require("drizzle-orm/pg-core");
const tsPattern = require("ts-pattern");
const icon = path.join(__dirname, "../../resources/icon.png");
const wowClassSchema = zod.z.enum([
  "Death Knight",
  "Demon Hunter",
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
  "Warrior"
]);
const wowRolesSchema = zod.z.enum(["Tank", "Healer", "DPS"]);
const wowRaidDiffSchema = zod.z.enum(["Normal", "Heroic", "Mythic"]);
zod.z.object({
  itemId: zod.z.number(),
  dmg: zod.z.number()
});
const simFightInfoSchema = zod.z.object({
  fightstyle: zod.z.string(),
  duration: zod.z.number().min(1),
  nTargets: zod.z.number().min(1)
});
const droptimizerSchema = zod.z.object({
  id: zod.z.string(),
  url: zod.z.string().url(),
  resultRaw: zod.z.string(),
  date: zod.z.number(),
  raidDifficulty: zod.z.string(),
  characterName: zod.z.string(),
  fightInfo: simFightInfoSchema
});
droptimizerSchema.omit({ id: true });
const characterSchema = zod.z.object({
  id: zod.z.string().uuid(),
  characterName: zod.z.string(),
  class: wowClassSchema,
  role: wowRolesSchema,
  droptimizer: zod.z.array(droptimizerSchema).optional()
});
const playerSchema = zod.z.object({
  id: zod.z.string().uuid(),
  playerName: zod.z.string(),
  characters: zod.z.array(characterSchema).optional()
});
characterSchema.omit({
  id: true,
  droptimizer: true
}).merge(playerSchema.omit({ id: true, characters: true }));
const isPresent = (value) => value !== null && value !== void 0;
const newUUID = () => uuid.v4();
require("dotenv").config();
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}
const db = nodePostgres.drizzle(databaseUrl);
const CLASSES = wowClassSchema.options;
const ROLES = wowRolesSchema.options;
const RAID_DIFF = wowRaidDiffSchema.options;
const pgClassEnum = pgCore.pgEnum("class", CLASSES);
const pgRoleEnum = pgCore.pgEnum("role", ROLES);
pgCore.pgEnum("raid_diff", RAID_DIFF);
const playerTable = pgCore.pgTable("players", {
  id: pgCore.varchar("id").primaryKey(),
  name: pgCore.varchar("name").notNull().unique()
});
const charTable = pgCore.pgTable("chars", {
  id: pgCore.varchar("id").primaryKey(),
  name: pgCore.varchar("name", { length: 24 }).notNull().unique(),
  // wow charname limit == 24
  class: pgClassEnum().notNull(),
  role: pgRoleEnum().notNull(),
  playerId: pgCore.varchar("player_id").references(() => playerTable.id).notNull()
});
const droptimizerTable = pgCore.pgTable("droptimizers", {
  id: pgCore.varchar("id").primaryKey(),
  url: pgCore.text("url").notNull(),
  resultRaw: pgCore.text("result_raw").notNull(),
  date: pgCore.integer("date").notNull(),
  fightStyle: pgCore.varchar("fight_style", { length: 50 }).notNull(),
  duration: pgCore.integer("duration").notNull(),
  nTargets: pgCore.integer("n_targets").notNull(),
  raidDifficulty: pgCore.varchar("raid_difficulty", { length: 20 }).notNull(),
  characterName: pgCore.varchar("character_name", { length: 24 }).notNull()
});
const raidSessionTable = pgCore.pgTable("raid_sessions", {
  id: pgCore.varchar("id").primaryKey(),
  startedAt: pgCore.integer("date").notNull(),
  completedAt: pgCore.integer("date")
});
pgCore.pgTable(
  "raid_sessions_roster",
  {
    id: pgCore.varchar("id").primaryKey(),
    raidSessionId: pgCore.varchar("raid_session_id").references(() => raidSessionTable.id).notNull(),
    charId: pgCore.varchar("char_id").references(() => charTable.id).notNull()
  },
  (t) => [
    pgCore.unique("raid_partecipation").on(t.raidSessionId, t.charId)
    // un char può partecipare ad una sessione alla volta
  ]
);
const bossTable = pgCore.pgTable("boss", {
  id: pgCore.integer("id").primaryKey(),
  // // ricicliamo journal_encounter_id fornito da wow api
  name: pgCore.varchar("name", { length: 255 }).notNull(),
  raid: pgCore.varchar("raid", { length: 255 }),
  order: pgCore.integer("order").notNull()
});
const itemTable = pgCore.pgTable("items", {
  id: pgCore.integer("id").primaryKey(),
  // ricicliamo id fornito da wow api
  name: pgCore.varchar("name", { length: 255 }).notNull(),
  ilvlMythic: pgCore.integer("ilvl_mythic"),
  ilvlHeroic: pgCore.integer("ilvl_heroic"),
  ilvlNormal: pgCore.integer("ilvl_normal"),
  bonusID: pgCore.varchar("bonus_id", { length: 50 }),
  itemClass: pgCore.varchar("item_class", { length: 50 }),
  slot: pgCore.varchar("slot", { length: 50 }),
  itemSubclass: pgCore.varchar("item_subclass", { length: 50 }),
  tierPrefix: pgCore.varchar("tier_prefix", { length: 50 }),
  // es: Dreadful
  tier: pgCore.boolean("tier").notNull().default(false),
  // se è un item tierser
  veryRare: pgCore.boolean("very_rare").notNull().default(false),
  specs: pgCore.text("specs"),
  specIds: pgCore.varchar("spec_ids", { length: 255 }),
  classes: pgCore.varchar("classes", { length: 255 }),
  classesId: pgCore.varchar("classes_id", { length: 50 }),
  stats: pgCore.text("stats"),
  mainStats: pgCore.varchar("main_stats", { length: 50 }),
  secondaryStats: pgCore.varchar("secondary_stats", { length: 50 }),
  wowheadUrl: pgCore.text("wowhead_url"),
  iconName: pgCore.varchar("icon_name", { length: 255 }),
  iconUrl: pgCore.text("icon_url"),
  bossName: pgCore.varchar("boss_name", { length: 255 }),
  // ridondante ma utile
  bossId: pgCore.integer("boss_id").references(() => bossTable.id).notNull()
});
const lootTable = pgCore.pgTable("loots", {
  id: pgCore.varchar("id").primaryKey(),
  dropDate: pgCore.integer("drop_date").notNull(),
  thirdStat: pgCore.varchar("third_stat", { length: 255 }),
  socket: pgCore.boolean("socket").notNull().default(false),
  // eligibility: text('eligibility').array(), // array of IDs referencing RaidSession.Chars
  raidSessionId: pgCore.varchar("raid_session_id").references(() => raidSessionTable.id).notNull(),
  itemId: pgCore.integer("item_id").references(() => itemTable.id).notNull(),
  bossId: pgCore.integer("boss_id").references(() => bossTable.id).notNull()
  // ridondato per comodità ma ricavabile da item.boss.id
});
pgCore.pgTable("assignments", {
  id: pgCore.varchar("id").primaryKey(),
  charId: pgCore.varchar("char_id").references(() => charTable.id).notNull(),
  lootId: pgCore.varchar("loot_id").references(() => lootTable.id).unique("loot_assignment").notNull()
  // un loot può essere assegnato una sola volta
});
pgCore.pgTable("bis_list", {
  id: pgCore.varchar("id").primaryKey(),
  charId: pgCore.varchar("char_id").references(() => charTable.id).notNull()
  //itemList: text('item_list').array() // array of strings
});
const parseAndValidate = (schema, rawData) => {
  const parsedResult = schema.safeParse(rawData);
  if (!parsedResult.success) {
    console.log(`Failed to parse data: ${parsedResult.error.errors}`);
    return null;
  }
  return parsedResult.data;
};
const takeFirstResult = (results) => results.length > 0 && isPresent(results[0]) ? results[0] : null;
const getPlayerByName = async (playerName) => {
  const result = await db.select().from(playerTable).where(drizzleOrm.eq(playerTable.name, playerName)).then(takeFirstResult);
  return parseAndValidate(playerSchema, result);
};
const addCharacter = async (character) => {
  const player = await getPlayerByName(character.playerName) ?? await addPlayer(character.playerName);
  if (!isPresent(player)) {
    console.log("Failed to creating or finding player");
    return null;
  }
  const result = await db.insert(charTable).values({
    id: newUUID(),
    name: character.characterName,
    class: character.class,
    role: character.role,
    playerId: player.id
  }).returning().execute().then(takeFirstResult);
  return parseAndValidate(playerSchema, result);
};
const addPlayer = async (playerName) => {
  const result = await db.insert(playerTable).values({
    id: newUUID(),
    name: playerName
  }).returning().execute().then(takeFirstResult);
  return parseAndValidate(playerSchema, result);
};
const addCharacterHandler = async (character) => {
  return await addCharacter(character);
};
const droptimizerModelSchema = zod.z.object({
  id: zod.z.string(),
  url: zod.z.string().url(),
  resultRaw: zod.z.string(),
  date: zod.z.number(),
  raidDifficulty: zod.z.string(),
  fightStyle: zod.z.string(),
  duration: zod.z.number().min(1),
  nTargets: zod.z.number().min(1),
  characterName: zod.z.string()
}).transform((data) => {
  return {
    id: data.id,
    url: data.url,
    resultRaw: data.resultRaw,
    date: data.date,
    raidDifficulty: data.raidDifficulty,
    characterName: data.characterName,
    fightInfo: {
      fightstyle: data.fightStyle,
      duration: data.duration,
      nTargets: data.nTargets
    }
  };
});
const addDroptimizer = async (droptimizer) => {
  const result = await db.insert(droptimizerTable).values({
    id: newUUID(),
    url: droptimizer.url,
    resultRaw: droptimizer.resultRaw,
    date: droptimizer.date,
    raidDifficulty: droptimizer.raidDifficulty,
    fightStyle: droptimizer.fightInfo.fightstyle,
    duration: droptimizer.fightInfo.duration,
    nTargets: droptimizer.fightInfo.nTargets,
    characterName: droptimizer.characterName
  }).returning().execute().then(takeFirstResult);
  return parseAndValidate(droptimizerModelSchema, result);
};
const csvDataSchema = zod.z.string().transform((data) => {
  const rows = data.split("\n").slice(1, -1).map((row) => {
    const [nameOrId, dmg] = row.split(",");
    return { nameOrId, dmg };
  });
  const [firstRow, ...itemRows] = rows;
  const characterName = firstRow.nameOrId;
  const baseDmg = Number(firstRow.dmg);
  const upgrades = itemRows.map((row) => ({
    id: row.nameOrId.split("/")[3],
    // Item ID is the fourth element
    dmg: Math.round(Number(row.dmg) - baseDmg)
  })).filter((item) => item.dmg > 0);
  return { characterName, baseDmg, upgrades };
});
const jsonDataSchema = zod.z.object({
  sim: zod.z.object({
    options: zod.z.object({
      fight_style: zod.z.string(),
      desired_targets: zod.z.number(),
      max_time: zod.z.number()
    })
  }),
  simbot: zod.z.object({
    title: zod.z.string(),
    simType: zod.z.literal("droptimizer")
    // At the moment, we only support droptimizer sims
  }),
  timestamp: zod.z.number()
}).transform((data) => {
  return {
    fightStyle: data.sim.options.fight_style,
    targets: data.sim.options.desired_targets,
    duration: data.sim.options.max_time,
    difficulty: data.simbot.title.split("•")[2].replaceAll(" ", ""),
    // Difficulty is the third element
    date: data.timestamp
  };
});
const fetchRaidbotsData = async (url) => {
  const [responseCsv, responseJson] = await Promise.all([
    fetch(`${url}/data.csv`),
    fetch(`${url}/data.json`)
  ]);
  const errorMessage = tsPattern.match([responseCsv.ok, responseJson.ok]).with(
    [false, true],
    () => `Failed to fetch CSV data: ${responseCsv.status} ${responseCsv.statusText}`
  ).with(
    [true, false],
    () => `Failed to fetch JSON data: ${responseJson.status} ${responseJson.statusText}`
  ).with(
    [false, false],
    () => [
      `Failed to fetch CSV data: ${responseCsv.status} ${responseCsv.statusText}`,
      `Failed to fetch JSON data: ${responseJson.status} ${responseJson.statusText}`
    ].join("\n")
  ).with([true, true], () => null).exhaustive();
  if (errorMessage) {
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
  const [csvData, jsonData] = await Promise.all([responseCsv.text(), responseJson.json()]);
  return { csvData, jsonData };
};
const parseRaidbotsData = (csvData, jsonData) => {
  const parsedCsv = csvDataSchema.parse(csvData);
  const parsedJson = jsonDataSchema.parse(jsonData);
  return { parsedCsv, parsedJson };
};
const addDroptimizerHandler = async (url) => {
  console.log("Adding droptimizer from url", url);
  const { csvData, jsonData } = await fetchRaidbotsData(url);
  const { parsedCsv, parsedJson } = parseRaidbotsData(csvData, jsonData);
  const droptimizer = {
    characterName: parsedCsv.characterName,
    raidDifficulty: parsedJson.difficulty,
    fightInfo: {
      fightstyle: parsedJson.fightStyle,
      duration: parsedJson.duration,
      nTargets: parsedJson.targets
    },
    url,
    resultRaw: csvData,
    date: parsedJson.date
  };
  return await addDroptimizer(droptimizer);
};
const allHandlers = {
  "add-droptimizer": addDroptimizerHandler,
  "add-character": addCharacterHandler
};
const registerHandlers = (handlers) => {
  for (const [channel, handler] of Object.entries(handlers)) {
    electron.ipcMain.handle(channel, async (event, ...args) => handler(...args));
  }
};
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  registerHandlers(allHandlers);
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
