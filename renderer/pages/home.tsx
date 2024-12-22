import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <React.Fragment>
      <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
        <div>
          <Image
            className="ml-auto mr-auto"
            src="/images/logo.png"
            alt="Logo image"
            width={256}
            height={256}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
