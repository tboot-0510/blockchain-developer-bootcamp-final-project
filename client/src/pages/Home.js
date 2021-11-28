import React, {useEffect} from 'react';
import {useDisclosure} from "@chakra-ui/react";
import ConnectButton from '../components/ConnectButton';
import AccountModal from '../components/AccountModal';
import Layout from '../components/Layout';
// import FormUserPage from '../components/CreateUser';
import LandingSet from '../components/LandingPage';
import logoImg from '../static/blockchain.png';

import {
  Flex,
  Center,
  Heading,
  Text,
  Stack,
  Image
} from '@chakra-ui/react';


function Logo(){
  return (
    <Center p={5} shadow="md">
      <Image
        objectPosition="center"
        boxSize="150px" 
        src={logoImg}
      />
      <Text ml="4" fontSize="6xl" color="white">MedLink</Text>
    </Center>
  )
}

const Home = () => {
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      h="100vh"
      bg="gray.800"
    >
      <Stack spacing={8}>
        <Logo />
        <LandingSet />
      </Stack>
    </Flex>
  )
};

export default Home;