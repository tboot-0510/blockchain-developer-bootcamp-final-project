import React from 'react';
import '../styles/Home.css';
import Layout from '../components/Layout';
import ConnectButton from '../components/ConnectButton';
import AccountModal from '../components/AccountModal';
import {useDisclosure} from '@chakra-ui/react';

const Home = () => {  
  const {isOpen, onOpen, onClose} = useDisclosure();
  
  return (
    <Layout>
      <ConnectButton handleOpenModal={onOpen}/>
      <AccountModal isOpen={isOpen} onClose={onClose}/>
    </Layout>
  );
}

export default Home;
