export function addressCompress(address: `0x${string}` | undefined): string {
  if (!address) return "No address provided";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
