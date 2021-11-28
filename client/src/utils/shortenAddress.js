export const shortenAddress = (address, num=4) => {
  if (!address) return '';
  return !!address && `${address.slice(0, num)}...${address.slice(address.length - num, address.length)}`;
}