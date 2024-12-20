import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-tailwindcss)</title>
      </Head>
      <div className="grid grid-col-1 mt-10 text-2xl w-full text-center">
        <div>
          <Image
            className="ml-auto mr-auto"
            src="/images/logo.png"
            alt="Logo image"
            width={256}
            height={256}
          />
        </div>
        <span>Project One - Companion</span>
      </div>
      <div className="mt-10 w-full flex-wrap flex justify-center">
        <Link href="/next">Gestione Roster</Link>
      </div>
    </React.Fragment>
  );
}
