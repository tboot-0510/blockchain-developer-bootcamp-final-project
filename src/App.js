import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { AppContextProvider } from './AppContext';
import { ethers } from 'ethers';
import Home from './pages/Home';
import Header from './components/Header';
import './styles/App.css';
import { ChakraProvider } from "@chakra-ui/react";

function getLibrary(provider){
  return new ethers.providers.Web3Provider(provider);
}

const App = () => {
  return (
    <ChakraProvider>
      <AppContextProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Route exact path="/" component={Home} />
        </Web3ReactProvider>
        </AppContextProvider>
    </ChakraProvider>
  );
};

export default App;
