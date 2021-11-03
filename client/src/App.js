import React from 'react';
import { BrowserRouter, Router, Route, Switch } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { AppContextProvider } from './AppContext';
import { ethers } from 'ethers';
import Home from './pages/Home';
import Admin from './pages/Admin';
import './styles/App.css';
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserHistory, createMemoryHistory } from 'history';

const hist = createMemoryHistory();

function getLibrary(provider){
  return new ethers.providers.Web3Provider(provider);
}
const App = () => {
  return (
    <ChakraProvider>
        <AppContextProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            {/* <Router history={hist}>
              <Switch> */}
                <Route exact path="/" component={Home} />
                <Route exact path="/admin" component={Admin} />
              {/* </Switch>
            </Router> */}
          </Web3ReactProvider>
        </AppContextProvider>
    </ChakraProvider>
  );
};

export default App;
