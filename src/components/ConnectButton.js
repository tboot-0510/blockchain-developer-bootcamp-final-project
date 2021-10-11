import React, {useEffect} from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../connectors';
import {Box, Button, Text, Heading} from '@chakra-ui/react'
import useEth from "../hooks/useEth";
import { useAppContext } from '../AppContext';

type Props = {
  handleOpenModal:any;
}

const ConnectButton = ({handleOpenModal}: Props) => {
  const {activate, active, account, deactivate} = useWeb3React();
  const {ethBalance, fetchEthBalance} = useEth();
  
  function handleConnectWallet(){
    activate(injected);
  }

  useEffect(() => {
    console.log('use effect ')
    if (account) {
      fetchEthBalance();
    }
  }, [account]);

  return account ? (
    <Box
      display="flex"
      alignItems="center"
      background="gray.700"
      borderRadius="xl"
      py="0"
    >
      <Box px="5">
        <Text color="white" fontSize="md">
          Status : {ethBalance}🟢 
        </Text>
      </Box>
      <Button
        onClick={handleOpenModal}
        bg="gray.800"
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
    </Box>
  ) : (
    <Button onClick={handleConnectWallet}> 
      Connect to a wallet
    </Button>
  );
};

export default ConnectButton;