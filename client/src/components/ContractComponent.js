import React, {useEffect} from 'react';
import ConnectButton from "../components/ConnectButton";
import AccountModal from '../components/AccountModal';
import {RINKEBY_LINK} from '../constant';
import {NotAllowedIcon, CheckIcon} from '@chakra-ui/icons'
import { useWeb3React } from '@web3-react/core';
import {
  Box,
  Alert, 
  AlertIcon,
  AlertTitle, 
  Heading, 
  Text, 
  Link, 
  HStack,
  Circle,
  useDisclosure,
} from '@chakra-ui/react';

export const ContractInfo = (props) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {active, account, chainId, library} = useWeb3React();
  const {error, verified, ...rest} = props;
  
  return (
    <Box 
      m={8}
      maxW={'400px'}
      w={'full'}
      minH={'50vh'}
      h={'auto'}
      bg={'white'}
      boxShadow={'2xl'}
      rounded={'md'}
    >
      {!verified && error && <Alert status="warning">
              <AlertIcon />
              <AlertTitle mr={2}>{error}</AlertTitle>
            </Alert>}
      <Box p={4}>
        <Heading>{props.title}</Heading>
      </Box>
      <Box display="flex" mx={6} mb={2}>
        <Text>Deployed Contract Address</Text>
        <Link px={2} href={RINKEBY_LINK} isExternal>🔗 </Link>
      </Box>
      <Box 
        mx={6}
        p={3}
        boxShadow={'inner'}
        rounded={'md'}
        border="1px" 
        borderColor="gray.200"
        borderRadius="xl"
        background="gray.200"
      >
        <Text mx={3} fontSize={"sm"}>{props.address}</Text>
      </Box>
      <Text mx={6} mb={2}>Current Owner</Text>
      <Box 
        mx={6}
        p={3}
        boxShadow={'inner'}
        rounded={'md'}
        border="1px" 
        borderColor="gray.200"
        borderRadius="xl"
        background="gray.200"
        minH="48px"
      >
        <Text mx={3} fontSize={"sm"}>{props.owner}</Text>
      </Box>
      <Box
        mx={6}
        p={3}
        borderRadius="xl"
      >
        {account && verified ? (
          <HStack>
          <Circle size="30px" bg="green" color="white">
            <CheckIcon/>
          </Circle>
          <Text pl={3}> Connected </Text>
        </HStack>
        ):(
          <HStack>
            <Circle size="30px" bg="red" color="white">
              <NotAllowedIcon/>
            </Circle>
            <Text pl={3}> Not Connected </Text>
          </HStack>
          )}
      </Box>
      <ConnectButton handleOpenModal={onOpen} verified={verified}/>
      <AccountModal isOpen={isOpen} onClose={onClose}/>
    </Box>
  )
}
