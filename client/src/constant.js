export const CONTRACT_ADDRESS = '0x5c1E592A0D2646Dd66FACC0f292257a8247BeEb2';
export const RINKEBY_LINK = `https://rinkeby.etherscan.io/address/${CONTRACT_ADDRESS}`

export enum ChainId {
  Ropsten = 3,
  Rinkeby = 4,
  Kovan = 42,
  Localhost = 1337,
};

export type Chain = {
  chainId: number
  chainName: string
}

const Ropsten: Chain = {
  chainId: 3,
  chainName: 'Ropsten'
}

const Rinkeby: Chain = {
  chainId: 4,
  chainName: 'Rinkeby'
}

const Kovan: Chain = {
  chainId: 42,
  chainName: 'Kovan'
}

const Localhost: Chain = {
  chainId: 1337,
  chainName: 'Localhost'
}

export const DEFAULT_SUPPORTED_CHAINS = [
  Localhost, 
  Ropsten,
  Rinkeby, 
  Kovan,
];
