import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { formatEther } from '@ethersproject/units';
import { useAppContext } from '../AppContext';

const useEth = () => {
  const {active, library, account} = useWeb3React();
  const {ethBalance, setEthBalance} = useAppContext();

  useEffect(() => {
    if (account){
      fetchBalance();
    };
  }, [account]);

  const fetchBalance = async () => {
    if (library && account && active){
      const balance = await library.getBalance(account);
      setEthBalance(parseFloat(formatEther(balance)).toPrecision(3));
    } else {
      setEthBalance('--');
    }
  };
  return {ethBalance, fetchBalance};
};

export default useEth;