import { InjectedConnector} from '@web3-react/injected-connector';

export const injected = new InjectedConnector({ supportedChainIds: [4, 1337]});
// ChainID -> match to network
// 1 Mainet \
// 3 Ropsten 
// 4 Rinkeby 
// 42 Kokan 
// 1337 Ganache test 
