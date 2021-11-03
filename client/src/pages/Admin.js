import React, {useEffect} from 'react';
import { Box, Heading, Flex, Text, Image} from '@chakra-ui/react';
import logoImg from '../static/blockchain.png';

const Header = (props) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="gray.800"
      color="white"
      {...props}
    >
      <Flex align="center" mr={5}>
        <Image
          objectPosition="center"
          boxSize="60px" 
          src={logoImg}
        />
        <Heading ml="5" as="h1" size="lg" letterSpacing={"-.1rem"}>
          MedLink
        </Heading>
      </Flex>
    </Flex>
  )
}

const ContractInfo = (props) => {
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      h="100vh"
      bg="gray.700"
    >
      <Text color="white" >{props.title}</Text>
      <Text color="white" >{props.title2}</Text>
    </Flex>
  )
}

const Admin = () => {
  return (
    <>
      <Header />
      <ContractInfo title="here" title2="here2"/>
    </>
    
  )
}
export default Admin;