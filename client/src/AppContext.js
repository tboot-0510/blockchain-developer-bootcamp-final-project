import React, {useState, useEffect, useContext, createContext, useReducer} from "react";

const initialContext = {
  ethBalance: '--',
  setEthBalance: () => {},
  verified: false, 
  setVerified: () => {},
  error: "", 
  setError: () => {},
  errorNetwork: "",
  setErrorNetwork: () => {},
}

const appReducer = (state, {type, payload}) => {
  switch (type) {
    case 'SET_ETH_BALANCE':
      return {
        ...state,
        ethBalance: payload,
      };
    case 'SET_VERIFIED_ACCOUNT':
      return {
        ...state,
        verified: payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: payload,
      };
    case 'SET_ERROR_NETWORK':
      return {
        ...state,
        errorNetwork: payload,
      };
    default:
      return state;
  }
};



const AppContext = createContext(initialContext);
export const useAppContext = () => useContext(AppContext);
export const AppContextProvider = ({children}) => {
  const [store, dispatch] = useReducer(appReducer, initialContext);

  const contextValue = {
    ethBalance: store.ethBalance,
    setEthBalance: (balance) => {
      dispatch({type:'SET_ETH_BALANCE', payload:balance});
    },
    verified: store.verified,
    setVerified: (verify) => {
      dispatch({type:'SET_VERIFIED_ACCOUNT', payload:verify})
    },
    error: store.error,
    setError: (msg) => {
      dispatch({type:'SET_ERROR', payload:msg})
    },
    errorNetwork: store.errorNetwork,
    setErrorNetwork: (msg) => {
      dispatch({type:'SET_ERROR_NETWORK', payload:msg})
    },
  };

  return <AppContext.Provider value={contextValue}>
    {children}
  </AppContext.Provider>

}