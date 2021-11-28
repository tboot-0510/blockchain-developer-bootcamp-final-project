import React, {useContext, useState} from 'react';

import {
  Box,
  Flex,
  Image,
  Heading, 
  Text,
  Button,
  Spacer
} from '@chakra-ui/react';
import logoImg from '../static/blockchain.png';
import { useRouter } from '../hooks/useRouter';

export const Header = (props) => {
  const router = useRouter();
  
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
        <Text as="sup" >{props.subtitle}</Text>
      </Flex>
      <Spacer />
      {/* <Link as={ReachLink} to='/'> Home </Link> */}
      <Button textColor={"black"} onClick={(e) => router.push("/")}> Home </Button>
    </Flex>
  )
}