import React, {useState, useEffect, useContext, createContext, useReducer} from "react";

const initialContext = {
  ethBalance: '--',
  setEthBalance: () => {},
}

const appReducer = (state, {type, payload}) => {
  switch (type) {
    case 'SET_ETH_BALANCE':
      return {
        ...state,
        ethBalance: payload,
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
  };

  return <AppContext.Provider value={contextValue}>
    {children}
  </AppContext.Provider>

}


// import React, { createContext, useReducer, useContext} from 'react';

// const initialContext = {
//   txnStatus: 'NOT_SUBMITTED',
//   setTxnStatus: () => {},

//   ethBalance: '--',
//   setEthBalance: () => {},
// };

// const appReducer = (state, { type, payload }) => {
//   switch (type) {
//     case 'SET_ETH_BALANCE':
//       return {
//         ...state,
//         setEthBalance: payload,
//       };

//     case 'SET_TXN_STATUS':
//       return {
//         ...state,
//         txnStatus: payload,
//       };
//     default:
//       return state;
//   }
// };

// const AppContext = createContext(initialContext);

// export const useAppContext = () => useContext(AppContext);

// export const AppContextProvider = ({ children }) => {

//   const [store, dispatch] = useReducer(appReducer, initialContext);
  
//   const contextValue = {
//     ethBalance: store.ethBalance,
//     setEthBalance: (balance) => {
//       dispatch({ type: 'SET_ETH_BALANCE', payload: balance});
//     },

//     txnStatus: store.txnStatus,
//     setTxnStatus: (status) => {
//       dispatch({ type: 'SET_TXN_STATUS', payload: status });
//     },
//   };
  
//   return (
//     <AppContext.Provider value={contextValue}>
//       {children}
//     </AppContext.Provider>
//   );
// };