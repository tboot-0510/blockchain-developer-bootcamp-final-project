import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Web3 from 'web3'
import { Web3ReactProvider } from '@web3-react/core';
import { AppContextProvider } from './AppContext';
import Home from './pages/Home';
import Header from './components/Header';
import './styles/App.css';
import { ChakraProvider } from "@chakra-ui/react";

function getLibrary(provider){
  return new Web3(provider);
}

const App = () => {
  return (
    <ChakraProvider>
      <AppContextProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <div>
            <Route exact path="/" component={Home} />
          </div>
        </Web3ReactProvider>
        </AppContextProvider>
    </ChakraProvider>
  );
};

export default App;
