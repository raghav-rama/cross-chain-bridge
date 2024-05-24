"use client";

import { addressCompress } from "@/utils/addressCompress";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";

export default function ConnectButton() {
  const { open } = useWeb3Modal();
  const { address, isConnecting, isDisconnected } = useAccount();

  return (
    <>
      <button
        onClick={() => open()}
        className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white inline-flex items-center bg-gray-100 border-0 py-1 px-3 mr-2 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
      >
        {isConnecting
          ? "Connecting..."
          : isDisconnected
          ? "Connect"
          : addressCompress(address)}
        <svg
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          className="w-4 h-4 ml-1"
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </button>
      <button
        onClick={() => open({ view: "Networks" })}
        className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
      >
        Open Network Modal
        <svg
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          className="w-4 h-4 ml-1"
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </button>
    </>
  );
}
