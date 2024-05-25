"use client";

import {
  useReadContract,
  useWriteContract,
  useSignMessage,
  useAccount,
  useWatchContractEvent,
  useSwitchChain,
} from "wagmi";
import bridgeCscAbi from "@/abi/BridgeCsc.json";
import bridgeEthAbi from "@/abi/BridgeEth.json";
import {
  solidityPackedKeccak256,
  solidityPacked,
  toBigInt,
  getBytes,
  hashMessage,
  recoverAddress,
  toBeArray,
  MessagePrefix,
  toUtf8Bytes,
} from "ethers";
import { encodePacked } from "viem";

import { useEffect, useState } from "react";
import { BRIDGE_CSC, BRIDGE_ETH } from "@/utils/constants";
import { sepolia } from "viem/chains";

export default function Bridge() {
  const { switchChainAsync } = useSwitchChain();
  useWatchContractEvent({
    address: BRIDGE_CSC,
    abi: bridgeCscAbi,
    eventName: "Transfer",
    onLogs: async (logs) => {
      console.log("Logs", logs);
      await switchChainAsync({ chainId: sepolia.id });
      mintOnSepolia();
    },
  });

  const [tokens, setTokens] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [nonce, setNonce] = useState<number>(45);
  const { address } = useAccount();
  const result = useReadContract({
    abi: bridgeCscAbi,
    address: BRIDGE_CSC,
    functionName: "token",
  });
  const { writeContract, data, status, error } = useWriteContract();
  const { signMessage } = useSignMessage();

  const handleSign = () => {
    console.log("Bridge", result.data);
    console.log("Bridge", parseInt(tokens));
    const abiHash = solidityPackedKeccak256(
      ["address", "address", "uint", "uint"],
      [
        address!,
        address!,
        toBigInt(`${tokens}000000000000000000`),
        toBigInt(32),
      ]
    );
    setNonce((nonce) => nonce + 1);
    console.log(nonce);
    console.log("Abi Hash", abiHash);
    const message = abiHash; // 0x52d76326769617bb06079c5273aebd071bba6ddfcda919549d8d60cc892bb021
    console.log("Hashed Message", hashMessage(message));
    setMessage(message);
    signMessage(
      { message },
      {
        onSuccess(data, variables, context) {
          console.log("Signature", data, status, error);
          setSignature(data);
        },
      }
    );
  };

  const handleBridge = () => {
    console.log("Sending txn...", status, signature);
    writeContract({
      address: BRIDGE_CSC,
      abi: bridgeCscAbi,
      functionName: "burn",
      args: [
        address,
        toBigInt(`${tokens}000000000000000000`),
        nonce,
        signature,
      ],
    });
  };

  const mintOnSepolia = () => {
    console.log("Minting on Sepolia");
    writeContract({
      address: BRIDGE_ETH,
      abi: bridgeEthAbi,
      functionName: "mint",
      args: [
        address,
        address,
        toBigInt(`${tokens}000000000000000000`),
        nonce,
        signature,
      ],
    });
  };

  const handleRecoverSigner = () => {
    console.log("Recover Signer", message, signature);
    const signer = recoverAddress(hashMessage(message), signature);
    console.log("Signer", signer);
    console.log("Utf8", toUtf8Bytes(MessagePrefix));
    console.log(
      "Packed",
      solidityPacked(["bytes"], [toUtf8Bytes(MessagePrefix)])
    );
  };

  // get tokens to bridge
  // select a nonce
  // first sign a message
  // burn tokens
  // listen to transaction event
  // mint tokens on sepolia

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700">
          <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
            Bridge
          </h5>

          <div>
            <div className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400">
              <svg
                className="w-3 h-3 me-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Transfer from
            </div>
          </div>

          <div>
            <label
              htmlFor="first_name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              CoinEx
            </label>
            <input
              type="text"
              id="first_name"
              onChange={(e) => setTokens(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="CoinEx"
            />
          </div>
          <div className="divide-y w-full flex justify-center items-center my-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
              />
            </svg>
          </div>
          <div>
            <div className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400">
              <svg
                className="w-3 h-3 me-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Transfer To
            </div>
          </div>
          <div>
            <label
              htmlFor="first_name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Sepolia
            </label>
            <input
              type="text"
              id="first_name"
              onChange={(e) => setTokens(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Sepolia"
            />
          </div>
          <button
            onClick={handleSign}
            type="button"
            className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 mt-5 w-full"
          >
            Sign Message
          </button>
          <button
            onClick={handleBridge}
            type="button"
            className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 mt-5 w-full"
          >
            Bridge
          </button>
          <button
            onClick={handleRecoverSigner}
            type="button"
            className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 mt-5 w-full"
          >
            Recover Signer
          </button>
          {data ? data : "Sending..."}
        </div>
      </div>
    </>
  );
}
