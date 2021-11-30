import React, {useEffect, useState, ReactNode, useCallback, useMemo} from 'react';
import { 
  Box, 
  Heading, 
  Flex, 
  Text, 
  Image, 
  Button,
  Spacer,
  useColorModeValue,
  Circle,
  HStack,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  Avatar,
  Center, 
  Wrap,
  Link,
  useToast,
  WrapItem
} from '@chakra-ui/react';
import { useRouter } from '../hooks/useRouter';
import {AddIcon, MinusIcon, NotAllowedIcon, CheckIcon} from '@chakra-ui/icons'

import { generate } from "shortid";
import notConnected from '../static/astronaut.png';
import { useWeb3React } from '@web3-react/core';
import abi from '../contracts/MedicalBlock.sol/MedicalBlock.json';
import {useContract} from '../hooks/useContract';
import FormApp from '../components/CreateUser';
import { shortenAddress } from '../utils/shortenAddress';
import { CONTRACT_ADDRESS } from '../constant';
import useVerifyAccount from '../hooks/useVerifyAccount';
import {useAppContext} from '../AppContext';

import {Header} from '../components/Header';
import {ContractInfo} from '../components/ContractComponent';
import { ProfileTab } from '../components/Profiles';
import { useParams, useLocation } from 'react-router-dom';

interface User {
  id: String;
  name: String;
  role: String;
  address: String;
}

type Props = {
  children?: ReactNode;
};

function Layout({ children }: Props) {
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="space-evenly"
      h="86vh"
      bg="gray.700"
    >
      {children}
    </Flex>
  );
}

const FunctionPanel = (props) => {
  const contract = useContract(CONTRACT_ADDRESS, abi.abi);
  const {onOpen, isOpen, onClose} = useDisclosure();
  const toast = useToast();
  const firstField = React.useRef();
  const {verified, participants, callbackFunction} = props;
  const { active, account, library } = useWeb3React();

  const [formData, setFormData] = useState();
  const [deleted, setDeleted] = useState('');
  const [allProfiles, setProfiles] = useState([]);

  const onSubmit = async (values) => {
    // extract data from form 
    setFormData(values);
    try {
      if (values.role === "doctor"){
        const tx = await contract.addDoctor(values.address, values.firstname+' '+values.lastname);
        contract.on('AddedProvider', (admin, user) => {
          console.log("✅ Event received");
          setProfiles(prevProfile => [...prevProfile,
            {
              id: generate(),
              name: values.firstname+' '+values.lastname,
              role: values.role,
              address: values.address
            }
          ]);
          toast({
            title: "Account created.",
            description: "We've created your account for you.",
            status: "success",
            duration: 4000,
            position:"top-right",
            isClosable: true,
          })
        });
        await tx.wait();
        console.log("✅ Tx successful");
        
        onClose();
      } else if (values.role === "patient"){
        const tx = await contract.addPatient(values.address, values.firstname+' '+values.lastname);

        contract.on('AddedPatient', (admin, user) => {
          console.log("✅ Event received");
          setProfiles(prevProfile => [...prevProfile,
            {
              id: generate(),
              name: values.firstname+' '+values.lastname,
              role: values.role,
              address: values.address
            }
          ]);
          toast({
            title: "Account created.",
            description: "We've created your account for you.",
            status: "success",
            duration: 4000,
            position:"top-right",
            isClosable: true,
          })
        });
        await tx.wait();
        console.log("✅ Tx successful");
        
        onClose();
      } else {
        throw Error ("Need to Add admin");
      }
      
    }catch (e) {
      let message = e.data && e.data.message ? e.data.message : e.error && JSON.parse(JSON.stringify(e.error)).body ? JSON.parse(JSON.parse(JSON.stringify(e.error)).body).error.message : e.data ? e.data : JSON.stringify(e);
      toast({
        title:"User Already exists!",
        description: `${JSON.parse(message).error.message}`,
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  const addProfile = (data) => {
    try {
      data.map((item, index) => (
        setProfiles(prevState => [...prevState, item])));
    }catch (e){
      console.log(e)
    }
  }
  const getNetwork = async (contract) => {
    try {
      var network = await contract.getNetwork();
      console.log('Network', network)
      for (let i = 0; i<network.length; i++){
        if (await contract.seeDoctorExists(network[i])){
          const info = await contract.getDoctorInfo(network[i]);
          setProfiles(currentProfile => [...currentProfile,
            {
              id: generate(),
              name: info.name,
              role: "doctor",
              address: info._address
            }
          ]);
        } else if (await contract.seePatientExists(network[i])){
          const info = await contract.getPatientDisplayInfo(network[i]);
          setProfiles(currentProfile => [...currentProfile,
            {
              id: generate(),
              name: info.name,
              role: "patient",
              address: info.addr
            }
          ]);
        }
      }
    } catch (e){
      console.log('error', e);
    }
  }

  const deleteFn = async (address) => {
    setDeleted(address);
    try {
      const tx = await contract.deleteAccount(address);
      contract.on('DeleteUser', (admin, user) => {
        console.log("✅ Event received");
        setProfiles(currentProfile => currentProfile.filter(profile => profile.address !== address));
        toast({
          title: "Account deleted.",
          description: "We've deleted the account for you.",
          status: "success",
          duration: 4000,
          isClosable: true,
        })
      });
      await tx.wait();
      console.log("✅ Tx successful");
    } catch (e){
      let message = e.data && e.data.message ? e.data.message : e.error && JSON.parse(JSON.stringify(e.error)).body ? JSON.parse(JSON.parse(JSON.stringify(e.error)).body).error.message : e.data ? e.data : JSON.stringify(e);
      if(!e.error && e.message){
        message = e.message
      }
      toast({
        title:"Delete User Revoked!",
        description: `${JSON.parse(message).error.message}`,
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (active){
      getNetwork(contract);
      addProfile(allProfiles);
    }
  }, [active])


  return (
    <Box 
      m={8}
      maxW={'50%'}
      w={'50%'}
      h={'80vh'}
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'2xl'}
      rounded={'md'}
    >
      <Flex m={10} direction="row">
        <Heading > My Network </Heading>
        <Spacer />
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onOpen}>
            Create participant
        </Button>
      </Flex>
        <Box
          mx={"auto"}
          maxW={'80%'}
          w={'80vw'}
          h={'auto'}
          rounded={'md'}
          border="1px" 
          borderColor="gray.200"
        >
        <Drawer
          isOpen={isOpen}
          placement="right"
          initialFocusRef={firstField}
          onClose={onClose}
          size={"md"}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">
              Create a new account
            </DrawerHeader>
            <DrawerBody>
              <Stack spacing="24px">
                <FormApp id="my-form" onSubmit={(formData) => onSubmit(formData)}/>
              </Stack>
            </DrawerBody>
            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Accordion defaultIndex={0} allowToggle>
          <AccordionItem>
            {({isExpanded}) => (
              <>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      See Participants
                    </Box>
                    <Box m={1} flex="2" textAlign="right">
                      {active && account && verified ? (
                        <Circle size="30px" bg="gray.400" color="white" as="span">
                          {allProfiles.length}
                        </Circle>
                      ):(
                        <Circle size="30px" bg="gray.400" color="white" as="span">
                          0
                        </Circle>
                      )}
                    </Box>
                    {isExpanded ? (
                      <MinusIcon fontSize="12px" />
                    ) : (
                      <AddIcon fontSize="12px" />
                    )}
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {active && account && verified ? (
                    <Wrap spacing="30px">
                      {allProfiles.map((item, index) =>
                        <WrapItem key={index}>
                          <ProfileTab title={item.role} userID={item.name} address={item.address} callbackFn={deleteFn}/>
                        </WrapItem>
                      )}
                    </Wrap>
                  ):(
                    <Center>
                      <Box align="center" mr={5}>
                        <Image
                          objectPosition="center"
                          boxSize="126px" 
                          src={notConnected}
                        />
                      <Text fontSize="3xl" alignItems="center"> Need to connect to fetch network </Text>
                      </Box>
                    </Center>
                  )}
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        </Accordion>          
      </Box>
    </Box>
  )
}

const Admin = () => {
  const contract = useContract(CONTRACT_ADDRESS, abi.abi);
  const {active, account} = useWeb3React();
  const {verified, verifyAccount, error} = useVerifyAccount(contract, account, "admin");
  const [owner, setOwner] = useState();

  const router = useRouter();
  console.log(router);

  const getOwner = useCallback(async (contract) => {
    try {
      const owner = await contract.owner();
      setOwner(owner);
    } catch (e) {
      console.log('error', e);
    }
  })


  useEffect(() => {
    console.log("On Admin : useEffect basics")
    if (active){
      console.log('Getting owner | Verify Account | Getting network ..');
      getOwner(contract);
      verifyAccount(contract, account, "admin");
    }
  }, [active]);
  
  console.log("rendering Admin Component");
  return (
    <>
      <Header subtitle="Admin"/>
      <Layout>
        <ContractInfo error={error} verified={verified} title="Contract Details" address={contract.address} owner={owner}/>
        <FunctionPanel verified={verified}/>
      </Layout>
    </>
    
  )
}
export default Admin;