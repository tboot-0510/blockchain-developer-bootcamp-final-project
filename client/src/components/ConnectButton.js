import React, {useEffect, useState} from 'react';
import { useWeb3React, UnsupportedChainIdError} from '@web3-react/core';
import { injected } from '../connectors';
import {
  Box, 
  Button, 
  Text
} from '@chakra-ui/react'
import {useRouter} from '../hooks/useRouter';

type Props = {
  handleOpenModal : any;
  verified: any;
}

const ConnectButton = ({handleOpenModal, verified}:Props) => {
  const {activate, active, account, deactivate, chainId} = useWeb3React();
  
  const router = useRouter();

  const checkWallet = async () => {
    const {ethereum} = window;
    if (!ethereum) {
      alert("Looks like you don't have Metamask, you'll need it to use this app.");
      return;
    }
    console.log('found metasmask object');
  }

  function handleConnectWallet(){
    checkWallet();
    activate(injected, (e) => {
      if (e instanceof UnsupportedChainIdError){
        alert('Change Network to RINKEBY');
      }
    });
  }
  

  function handleLogOut(){
    deactivate();
    router.push('/');
  }

  useEffect(() => {
    if(window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
      // window.ethereum.on('accountsChanged', () => {
      //   window.location.reload();
      // })
    }
  });

  return account && verified ? (
    <Box>
      <Text mx="7" align="left"> Account Overview </Text>
    <Box
      mx="6"
      mb="6"
      display="flex"
      justifyContent="space-between"
    >
      <Button
        onClick={handleOpenModal}
        bg="gray.400"
        border="1px solid transparent"
        _hover={{
          border: "1px",
          borderStyle: "solid",
          borderColor: "blue.400",
          backgroundColor: "gray.700",
        }}
        borderRadius="xl"
        m="1px"
        px={3}
        height="38px"
      >
        <Text color="white" fontSize="md" fontWeight="medium" mr="2">
          {account &&
            `${account.slice(0, 6)}...${account.slice(
              account.length - 4,
              account.length
            )}`}
        </Text>
      </Button>
      <Button
        onClick={handleLogOut}
        bg="gray.400"
        m="1px"
        height="38px"
      >
        Log Out 
      </Button>
    </Box>
  </Box>
        
  ) : (
    <Box>
      <Button 
        m="6"
        background="gray.400"
        onClick={() => handleConnectWallet()}
      > 
        Connect to a wallet 
      </Button>
    </Box>
  );
};

export default ConnectButton;