import { defineChain } from "viem";

export const coinExTestnet = /*#__PURE__*/ defineChain({
  id: 53,
  name: "CoinEx Testnet",
  nativeCurrency: { name: "CoinEx Testnet", symbol: "CETT", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.coinex.net"],
    },
  },
  blockExplorers: {
    default: {
      name: "CoinEx Testnet",
      url: "https://testnet.coinex.net",
      apiUrl: "https://www.coinex.net/api/v1",
    },
  },
  testnet: true,
});

export const TOKEN_ETH = "0x3dab8705d0a112e40872aadbf70fcee0321d82ef";
export const BRIDGE_ETH = "0x77fceb71adecb115f861f22b580add46c0fa1173";
export const TOKEN_CSC = "0x800E9AD3aCbf7b80a3f2e06Ac5C2B8565dC4c44c";
export const BRIDGE_CSC = "0x0aAb38709774593d1641a7F902022Be729Be9986";
