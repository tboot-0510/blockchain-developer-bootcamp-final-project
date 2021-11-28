import React, {useEffect, useState, ReactNode} from 'react';
import { 
  Box, 
  Heading, 
  Flex, 
  Text, 
  Image, 
  VStack,
  Spacer,
  Center,
  Table, 
  Thead, 
  Tr,
  Th,
  Tbody
} from '@chakra-ui/react';

import { generate } from "shortid";
import notConnected from '../static/astronaut.png';
import { useWeb3React } from '@web3-react/core';
import abi from '../../../smart-contract/artifacts/contracts/MedicalBlock.sol/MedicalBlock.json';
import {useContract} from '../hooks/useContract';
import TablesTableRow from '../components/TablesTableRow';
import { CONTRACT_ADDRESS } from '../constant';
import useVerifyAccount from '../hooks/useVerifyAccount';
import Identicon from "../components/IdentityIcon";
import {useAppContext} from '../AppContext';
import {Header} from '../components/Header';
import {ContractInfo} from '../components/ContractComponent';


interface User {
  id: String;
  name: String;
  role: String;
  address: String;
  statusR: Boolean;
  statusW: Boolean;
  date: String;
}

type Props = {
  children?: ReactNode;
};

function Layout({ children }: Props) {
  return (
    <Flex
      flexDirection="row"
      justifyContent="space-evenly"
      h="auto"
      bg="gray.700"
    >
      {children}
    </Flex>
  );
}

const InfoPanel = (props) => {
  const {active, account} = useWeb3React();
  const {logo, verified, ...rest} = props;

  return (
    <Box 
      m={8}
      maxW={'400px'}
      w={'full'}
      minH={'auto'}
      h = {"10vh"}
      bg={'white'}
      boxShadow={'2xl'}
      rounded={'md'}
    >
      <Box p={4}>
        {account && active && verified ? (
          <Flex direction="row" alignItems="center">
            <Identicon account={account} size={50}/>
            <Heading mx={4} size="lg">{props.name}</Heading>
          </Flex>
        ):(
          <Heading>{props.title}</Heading>
        )}
      </Box>
    </Box>
  )
}

const Tables = (props) => {
  const textColor = "gray.700";
  const {participants, doctorProps} = props;
  return (
    <Table variant="simple" color={textColor}>
      <Thead>
        <Tr my=".8rem" pl="0px" color="gray.400">
          <Th pl="0px" color="gray.400">Name</Th>
          <Th color="gray.400">Status (R | W)</Th>
          <Th color="gray.400">Added</Th>
          <Th color="gray.400">Tools</Th>
        </Tr>
      </Thead>
      <Tbody>
        {participants.map((row, index) => {
          return (
            <TablesTableRow key={index}
              name={row.name}
              address={row.address}
              statusR={row.statusR}
              statusW={row.statusW}
              date={row.date}
              type="doctorTools"
              doctorProps={doctorProps}
            />
          );
        })}
      </Tbody>
    </Table>
  )
}

const FunctionPanel = (props) => {
  const {active, account} = useWeb3React();
  const {verified, participants, doctorProps} = props;


  return (
    <Box 
      m={8}
      maxW={'70%'}
      w={'60%'}
      minH={'80vh'}
      bg={'white'}
      boxShadow={'2xl'}
      rounded={'md'}
    >
      <Flex m={10} direction="row" minH={'auto'}>
        <Heading > My Patient Network </Heading>
        <Spacer />
      </Flex>
      <Box
        mx={"auto"}
        maxW={'90%'}
        w={'95vw'}
        h={'auto'}
        rounded={'md'}
      >
        {account && active && verified ? (
          <Flex direction="column">
            <Tables participants={participants} doctorProps={doctorProps}/>
          </Flex>
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
      </Box>
    </Box>
  )
}

const Doctor = () => {
  const contract = useContract(CONTRACT_ADDRESS, abi.abi);
  const {active, account} = useWeb3React();
  const [owner, setOwner] = useState();
  const [doctorName, setDoctorName] = useState();
  const {verified, verifyAccount, error} = useVerifyAccount(contract, account, "doctor");
  const {errorNetwork} = useAppContext();

  const [participants, setParticipants] = useState<User[]>([]);
  const [allPatients, setAvailablePatients] = useState<User[]>([]);
  const [allDoctors, setDoctorAddr] = useState([]);

  const getOwner = async (contract) => {
    try {
      const owner = await contract.getOwner();
      setOwner(owner);
    } catch (e) {
      console.log('error', e);
    }
  }
  const getInfo = async (contract) => {
    try {
      const info = await contract.getDoctorInfo(account);
      setDoctorName(info.name);
    } catch (e) {
      console.log('error', e);
    }
  }
  const getAllPatients = async (contract) => {
    try {
      var network = await contract.getPatientList();
      for (let i = 0; i<network.length; i++){
        const info = await contract.getPatientDisplayInfo(network[i]);
        const [permRead, permWrite] = await contract.getPermissions(network[i], account);
        setAvailablePatients(currentProfile => [...currentProfile,
          {
            id: generate(),
            name: info.name,
            role: "patient",
            address: info.addr,
            statusR: permRead, 
            statusW: permWrite,
            date: new Date(info.date * 1000).toLocaleDateString("en-US"),

          }
        ]);
      }
    } catch (error){
      console.log(error);
    }
  }

  const getAllDoctors = async (contract) => {
    try {
      const doctorAddr = await contract.getDoctorList()
      setDoctorAddr(doctorAddr);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (active){
      console.log('Getting owner | Verify Account | Getting network ..');
      getOwner(contract);
      verifyAccount(contract, account, "doctor");
      getInfo(contract);
      getAllPatients(contract);
      getAllDoctors(contract);
    }
  }, [active]);


  const doctorProps = {
    doctor : {
      verified:verified,
      name: doctorName,
      address: account
    },
    network : {
      allDoctors : allDoctors,
    }
  }

  return (
    <>
      <Header subtitle="Doctor"/>
      <Layout>
        <VStack >
          <InfoPanel verified={doctorProps.doctor.verified} title="My Info" name={doctorProps.doctor.name} verified={doctorProps.doctor.verified}/>
          <ContractInfo error={error} verified={verified} title="Contract Details" address={contract.address} owner={owner}/>
        </VStack>
        <FunctionPanel verified={doctorProps.doctor.verified} participants={allPatients} doctorProps={doctorProps}/>
      </Layout>
    </>
    
  )
}
export default Doctor;