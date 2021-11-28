import {
  Heading,
  Avatar,
  Box,
  Flex,
  Text,
  Stack,
  Button,
  IconButton,
  AvatarBadge,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom'
import { shortenAddress } from '../utils/shortenAddress';
import Identicon from "../components/IdentityIcon";
import { DeleteIcon } from '@chakra-ui/icons'

export const ProfileTabLandingPage = ({title, userID, address, pageID}) => {
  const history = useHistory();

  return (
    <Box
      m={8}
      minW={'250px'}
      h={'50vh'}
      bg={'white'}
      boxShadow={'2xl'}
      rounded={'md'}
      overflow={'hidden'}>
      <Flex justify={'center'} mt={5}>
        <Avatar
          size={'xl'}
          name={title}
          alt={'Author'}
          css={{
            border: '2px solid white',
          }}
        />
      </Flex>

      <Box p={6}>
        <Stack spacing={0} align={'center'} mb={5}>
          <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
            {title}
          </Heading>
          <Text color={'gray.500'}>@{userID}</Text>
          <Text color={'gray.500'}>{shortenAddress(address)}</Text>
        </Stack>
        <Button
          w={'200px'}
          mt={8}
          bg={useColorModeValue('#151f21', 'gray.900')}
          color={'white'}
          rounded={'md'}
          onClick={() => history.push(pageID)}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          }}>
          Connect now
        </Button>
      </Box>
    </Box>
  );
}


export const ProfileTab = ({title, userID, address, callbackFn}) => {

  function handleClick(){
    callbackFn(address);
  }

  return (
    <Box
      m={0.5}
      w={'95px'}
      h={'auto'}
      rounded={'md'}
      overflow={'hidden'}
    >
      <Flex direction="row" justify={'center'} mt={2} >
        <Identicon account={address} size={50}/>
      </Flex>
      <Box p={1}>
        <Stack spacing={0} align={'center'} mb={1}>
          <Flex direction="row">
            <Heading fontSize={'md'} fontWeight={500} fontFamily={'body'}>
              {title}
            </Heading>
            <IconButton 
              size="20px" 
              ml={2} 
              onClick={handleClick}
              icon={<DeleteIcon boxSize="12px"/>} 
            />
          </Flex>
          <Text fontSize={"sm"} color={'gray.500'}>{shortenAddress(address)} </Text>
          <Text fontSize={"sm"} color={'gray.500'}>@{userID}</Text>
        </Stack>
      </Box>
      
    </Box>
  )
}