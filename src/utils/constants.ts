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
export const TOKEN_CSC = "0x7b28b685ea246c834337eb2f499b093a2808bb04";
export const BRIDGE_CSC = "0x43fab08293e4f7f18cce62d36dbf676c425dbe9c";
