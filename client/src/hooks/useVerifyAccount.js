import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppContext } from '../AppContext';
import { shortenAddress } from '../utils/shortenAddress';

const useVerifyAccount = (contract, account, type) => {
  const {active, library} = useWeb3React();
  const {verified, setVerified} = useAppContext();
  const {error, setError} = useAppContext();

  useEffect(() => {
    if (account){
      verifyAccount();
    };
  }, [account]);

  const verifyAccount = async (contract, account, type) => {
    if (library && active){
      if (type === 'admin'){
        var exist = await contract.seeAdminExists(account);
        setVerified(exist);
        if (!exist){
          setError(`${shortenAddress(account)} is not registered as admin - change account`)
        };
      }
      else if (type === 'doctor'){
        var exist = await contract.seeDoctorExists(account);
        setVerified(exist);
        if (!exist){
          setError(`${shortenAddress(account)} is not registered as doctor - change account or contact admin`)
        };
      }
      else if (type === 'patient'){
        var exist = await contract.seePatientExists(account);
        setVerified(exist);
        if (!exist){
          setError(`${shortenAddress(account)} is not registered as patient - change account or contact admin/doctor`)
        };
      }
    }
  };
  return {verified, verifyAccount, error};
};

export default useVerifyAccount;