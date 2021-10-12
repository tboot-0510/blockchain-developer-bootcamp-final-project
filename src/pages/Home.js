import React, {useEffect} from 'react';
import {useDisclosure} from "@chakra-ui/react";
import {Container, Button} from 'react-bootstrap';
import { injected } from '../connectors';
import {useWeb3React} from '@web3-react/core';
import useEth from '../hooks/useEth';
import ConnectButton from '../components/ConnectButton';
import AccountModal from '../components/AccountModal';
import Layout from '../components/Layout';


const Home = () => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  // const {ethBalance, fetchBalance} = useEth();
  // const {activate, library, account, deactivate} = useWeb3React();
  
  
  // return (
  //   <Container className="mt-5">
  //     <MetaMaskButton />
  //     <Balance />
  //   </Container>
  // )
  return (
    <Layout>
      <ConnectButton handleOpenModal={onOpen}/>
      <AccountModal isOpen={isOpen} onClose={onClose}/>
    </Layout>
  )
};

export default Home;