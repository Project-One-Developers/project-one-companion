import React, { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { CLASSES, ROLES } from "../lib/classes";

export default function NextPage() {
  const [playerName, setPlayerName] = React.useState("");
  const [characterName, setCharacterName] = React.useState("");
  const [playerClass, setPlayerClass] = React.useState("");
  const [playerRole, setPlayerRole] = React.useState("");

  const resetForm = () => {
    setPlayerName("");
    setPlayerClass("");
    setPlayerRole("");
    setCharacterName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerName || !playerClass || !playerRole || !characterName) {
      return;
    }
    const players = JSON.parse(window.localStorage.getItem("players")) || [];
    players.push({
      name: playerName,
      class: playerClass,
      role: playerRole,
      character: characterName,
    });
    window.localStorage.setItem("players", JSON.stringify(players));
    resetForm();
  };

  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-tailwindcss)</title>
      </Head>
      <div className="flex flex-col justify-center items-center mt-10 text-2xl w-full text-center">
        <div>
          <h1>Aggiungi player</h1>
        </div>
        <form
          className="flex flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={playerName}
            placeholder="Nome player"
            className="w-full mt-10 text-center text-blue-600"
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <input
            type="text"
            value={characterName}
            placeholder="Nome persoanggio"
            className="w-full mt-10 text-center text-blue-600"
            onChange={(e) => setCharacterName(e.target.value)}
          />
          <select
            className="w-full mt-10 text-center text-blue-600"
            onChange={(e) => setPlayerClass(e.target.value)}
            defaultValue={""}
            value={playerClass}
          >
            <option value={""} disabled>
              Scegli una classe
            </option>
            {CLASSES.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
          <select
            className="w-full mt-10 text-center text-blue-600"
            onChange={(e) => setPlayerRole(e.target.value)}
            defaultValue={""}
            value={playerRole}
          >
            <option value={""} disabled>
              Scegli un ruolo
            </option>
            {ROLES.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
          <button
            disabled={
              !playerName || !playerClass || !playerRole || !characterName
            }
            className="w-full mt-10 text-center bg-gray-50 text-blue-600 cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            Aggiungi
          </button>
        </form>
      </div>
      <div className="flex flex-col justify-center items-center mt-10 text-2xl w-full text-center">
        <button
          onClick={() => {
            console.log(window.localStorage.getItem("players"));
          }}
        >
          SHOW ME THE ROSTER
        </button>
        <button
          onClick={() => {
            window.localStorage.clear();
          }}
        >
          RESET LOCAL STORAGE
        </button>
        <Link href="/roster">Guarda il roster</Link>
      </div>
    </React.Fragment>
  );
}
