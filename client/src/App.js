import React from 'react';
import { BrowserRouter, Router, Route, Switch } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { AppContextProvider } from './AppContext';
import { ethers } from 'ethers';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Doctor from './pages/Doctor';
import Patient from './pages/Patient';
import './styles/App.css';
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

function getLibrary(provider){
  return new ethers.providers.Web3Provider(provider);
}
const App = () => {
  return (
    <ChakraProvider>
        <AppContextProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
          <BrowserRouter history={history}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/admin" component={Admin} />
              <Route path="/doctor" component={Doctor} />
              <Route path="/patient" component={Patient} />
            </Switch>
          </BrowserRouter>
          </Web3ReactProvider>
        </AppContextProvider>
    </ChakraProvider>
  );
};

export default App;
