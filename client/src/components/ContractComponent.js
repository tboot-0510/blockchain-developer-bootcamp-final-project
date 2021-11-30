import React, {useContext, useEffect, useState} from 'react';
import ConnectButton from "../components/ConnectButton";
import AccountModal from '../components/AccountModal';
import { CONTRACT_ADDRESS, RINKEBY_LINK, ChainId, DEFAULT_SUPPORTED_CHAINS} from '../constant';
import {ChevronDownIcon, NotAllowedIcon, CheckIcon} from '@chakra-ui/icons'
import { injected } from '../connectors';
import {useAppContext} from '../AppContext';
import { useWeb3React } from '@web3-react/core';
import {
  Box,
  Flex,
  Alert, 
  AlertIcon,
  Button,
  AlertTitle, 
  Heading, 
  Text, 
  Link, 
  HStack,
  Circle,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
} from '@chakra-ui/react';

const NetworkSelection = () => {
  const {chainId} = useWeb3React();
  console.log(chainId, typeof chainId);
  const { errorNetwork, setErrorNetwork } = useAppContext();
  const [changingNetwork, setChangingNetwork] = useState(false);

  const {isOpen, onOpen, onClose} = useDisclosure({
    isOpen:
      typeof errorNetwork !== ""
  })

  const changeNetwork = async (chainId) => {
    if (typeof window === "undefined" || typeof window.ethereum === "undefined")
      return;
      setChangingNetwork(true);
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + chainId}],
      });
    } catch (err) {
      console.log("error while switching")
    } finally {
      setChangingNetwork(false);
    }
  };

  const getChainName = (networkId: ChainId) => {
    const name = DEFAULT_SUPPORTED_CHAINS.find((network) => network.chainId === networkId)?.chainName || ''
    return name 
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change Network</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>We do not support this network.</p>
        </ModalBody>

        <ModalFooter>
          <Menu>
            <MenuButton
              colorScheme="blue"
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              Select Network
            </MenuButton>
            <MenuList>
              {injected.supportedChainIds.map((networkId, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      console.log('clicked');
                      changeNetwork(parseInt(networkId))
                    }
                    }
                  >
                    {getChainName(parseInt(networkId))}
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// const NetworkError = () => {
//   const { errorNetwork, setErrorNetwork } = useAppContext();
//   useEffect(() => {
//     if (errorNetwork) {
//       setTimeout(() => {
//         setContentError('');
//       }, 5000);
//     }
//   }, [errorNetwork]);

//   if (!errorNetwork) {
//     return null;
//   }
//   return (
//     <Flex bg={"tomato"}>
//       <Text>{errorNetwork}</Text>
//     </Flex>
//   );
// };

const NotActive = () => {
  return (
    <Alert status="warning">
      <AlertIcon />
      <AlertTitle mr={2}>Connect to Rinkeby Network</AlertTitle>
    </Alert>
  );
};

export const ContractInfo = (props) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {active, account, chainId} = useWeb3React();
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
      {/* {!active && !injected.supportedChainIds.includes(chainId) && <NotActive />} */}
      {!verified && error && <Alert status="warning">
              <AlertIcon />
              <AlertTitle mr={2}>{error}</AlertTitle>
            </Alert>}
      {/* <NetworkSelection /> */}
      {/* <NetworkError /> */}
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
