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

export const TOKEN_ETH = "0x50f945be40ee18133530388233151B920d5A9e3B";
export const BRIDGE_ETH = "0xB31361338997324b12aa8C61CDAceA3734112dA9";
export const TOKEN_CSC = "0xaEc6Cbcd78a05dFc5Cdd4F15138999fbE9600dF5";
export const BRIDGE_CSC = "0xCe803c804EC51Ed4F589eA5Cc6210122aF305758";
