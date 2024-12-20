import React, { use, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { CLASSES, ROLES } from "../lib/classes";

export default function NextPage() {
  const [url, setUrl] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  function persistPlayerUpgrade(data: {
    playerName: string;
    fightStyle: string;
    targets: number;
    time: number;
    difficulty: string;
    upgrade: { name: string; dmg: number }[];
  }) {
    // persiste in the local storage the upagrade of the player
    let players = JSON.parse(window.localStorage.getItem("players")) || [];
    let player = players.find((p) => p.character === data.playerName);
    if (!player) {
      console.log("Player not found");
      return;
    }
    player = {
      ...player,
      fightStyle: data.fightStyle,
      targets: data.targets,
      time: data.time,
      difficulty: data.difficulty,
      upgrades: data.upgrade,
    };
    players = players.filter((p) => p.character !== data.playerName);
    players.push(player);
    window.localStorage.setItem("players", JSON.stringify(players));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url) {
      return;
    }
    setIsLoading(true);

    const response = await fetch(`${url}/data.csv`);
    const data = await response.text();
    let csvData = data
      .split("\n")
      .map((row) => ({ name: row.split(",")[0], dmg: row.split(",")[1] }));
    csvData = csvData.slice(1);
    const charName = csvData[0].name;
    const charBaseDmg = csvData[0].dmg;

    const parsedData = csvData
      .slice(1)
      .map((d) => ({
        name: d.name.split("/")[3],
        dmg: Math.round(Number(d.dmg) - Number(charBaseDmg)),
      }))
      .filter((d) => d.dmg > 0);

    const response2 = await fetch(`${url}/data.json`);
    const data2 = await response2.json();
    const fightStyle = data2.sim.options.fight_style;
    const targets = data2.sim.options.desired_targets;
    const time = data2.sim.options.max_time;
    const difficulty = data2.simbot.title.split("•")[2].replaceAll(" ", "");

    persistPlayerUpgrade({
      playerName: charName,
      fightStyle,
      targets,
      time,
      difficulty,
      upgrade: parsedData,
    });
    setIsLoading(false);
  }

  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-tailwindcss)</title>
      </Head>
      <div>
        <h1>Roster</h1>
        {isLoading ? (
          <p>fetching droptimizer...</p>
        ) : (
          <form
            className="flex flex-col justify-center items-center"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              className=" text-blue-500"
              placeholder="Inserisci url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button
              disabled={!url}
              className="w-full h-10 mt-10 text-center bg-gray-50 text-blue-600 cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              Parsa
            </button>
          </form>
        )}
      </div>
      <Link href="/next">Aggiungi player</Link>
      <Link href="/droptimizer">Aggiungi droptimizer</Link>
      <button
        onClick={() => {
          console.log(JSON.parse(window.localStorage.getItem("players")));
        }}
      >
        Show me the storage motherfucker
      </button>
    </React.Fragment>
  );
}
