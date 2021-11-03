import React, {useEffect} from 'react';
import {Container} from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../connectors';
import {Box, Button, Text, Heading} from '@chakra-ui/react'
import useEth from '../hooks/useEth';

type Props = {
  handleOpenModal : any;
}

const ConnectButton = ({handleOpenModal}:Props) => {
  const {activate, active, account, deactivate} = useWeb3React();
  const {fetchBalance, ethBalance} = useEth();

  const checkWallet = async () => {
    const {ethereum} = window;

    const accounts = await ethereum.request({method: 'eth_accounts'});
    console.log(accounts)
  }


  function handleConnectWallet(){
    activate(injected);
  }

  useEffect(() => {
    checkWallet();
    if (account){
      fetchBalance();
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
          🟢 {ethBalance} ETH
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
    <Box>
      <Button onClick={() => handleConnectWallet()}> Connect to a wallet </Button>
    </Box>
  );
};

export default ConnectButton;