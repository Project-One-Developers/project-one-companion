import React, { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { CLASSES, ROLES } from "../lib/classes";

export default function NextPage() {
  const [players, setPlayers] = React.useState([]);

  useEffect(() => {
    const players = JSON.parse(window.localStorage.getItem("players")) || [];
    setPlayers(players);
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-tailwindcss)</title>
      </Head>
      <div>
        <h1>Roster</h1>
        <div>
          {players.map((player) => (
            <div key={player.name} className="flex justify-center gap-x-2">
              <h2>{player.name}</h2>
              <p>{player.class}</p>
              <p>{player.role}</p>
              <p>{player.character}</p>
            </div>
          ))}
        </div>
      </div>
      <Link href="/next">Aggiungi player</Link>
      <Link href="/droptimizer">Aggiungi droptimizer</Link>
    </React.Fragment>
  );
}
