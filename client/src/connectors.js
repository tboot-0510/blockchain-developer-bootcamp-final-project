import { InjectedConnector} from '@web3-react/injected-connector';

export const injected = new InjectedConnector({ supportedChainIds: [1, 4, 42, 1337]});
// ChainID -> match to network
// 1 Mainet \
// 4 Rinkeby 
// 42 Kokan 

// export const network = new NetworkConnector({
//   urls: {
//     1337: 'http://localhost:3000',
//   },
//   defaultChainId: 1,
// });