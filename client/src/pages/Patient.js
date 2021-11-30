import React, {useEffect, useState, useCallback, ReactNode} from 'react';
import { 
  Box, 
  Heading, 
  Flex, 
  Text, 
  Image, 
  Button,
  useColorModeValue,
  Circle,
  HStack,
  VStack,
  IconButton,
  useDisclosure,
  Collapse,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Grid, 
  GridItem,
  Alert,
  AlertIcon,
  AlertTitle,
  Spacer,
  Link,
  Center,
  Tooltip,
  Divider,
  Input,
  InputGroup,
  useToast,
  InputLeftAddon,
} from '@chakra-ui/react';
import {
  Table, 
  Thead, 
  Tr,
  Td, 
  Th,
  Tbody
} from '@chakra-ui/react';

import {ArrowDownIcon, ArrowUpIcon, LockIcon, UnlockIcon, AttachmentIcon, NotAllowedIcon, CheckIcon, ViewIcon} from '@chakra-ui/icons'

import { generate } from "shortid";
import notConnected from '../static/astronaut.png';
import ConnectButton from "../components/ConnectButton";
import AccountModal from '../components/AccountModal';
import { useWeb3React } from '@web3-react/core';
import abi from '../contracts/MedicalBlock.sol/MedicalBlock.json';
import {useContract} from '../hooks/useContract';
import TablesTableRow from '../components/TablesTableRow';
import { shortenAddress } from '../utils/shortenAddress';
import { CONTRACT_ADDRESS, RINKEBY_LINK } from '../constant';
import useVerifyAccount from '../hooks/useVerifyAccount';
import Identicon from "../components/IdentityIcon";
import { Controller, useForm } from "react-hook-form";
import {IPFS_GATEWAY} from '../ipfs';

import {useAppContext} from '../AppContext';
import { encryptData, getIPFSHashFromBytes32, getBytes32FromIpfsHash, decryptEHR, addToIPFS } from "../utils/encrypt-tools";
import {Header} from '../components/Header';


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

const EHRPatientView = (props) => {
  const {details, provider, attachement, date, time} = props;
  const {isOpen, onToggle} = useDisclosure();
  const [checked, setChecked] = useState(false);

  return (
    <Box mx="2">
      <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
        <Flex direction="column" minWidth="20%">
          <Text fontSize="sm" color="gray.400" fontWeight="normal">
            {time}
          </Text>
          <Text fontSize="sm" color="gray.400" fontWeight="normal">
            {date}
          </Text>
        </Flex>
        <Text
          fontSize="md"
          fontWeight="normal"
          minWidth="15%"
        >
          From :
        </Text>
        <Flex >
          <Text fontSize="md" fontWeight="bold"> 
            {shortenAddress(provider,10)} 
          </Text>
        </Flex>
        <Spacer/>
        <>
        {attachement ? (
          <IconButton 
            size="sm" 
            ml={2}
            icon={<AttachmentIcon/>}
            onClick={() => window.open(attachement)}
            />
        ):(
          null
        )}
        </>
        <Tooltip label="See attached EHR" placement="top">
          {!checked ? (
            <IconButton 
              size="sm" 
              ml={2}
              icon={<ArrowDownIcon/>} 
              onClick={() => (
                onToggle(),
                setChecked(!checked)
              )}
            />
          ):(
            <IconButton 
              size="sm" 
              ml={2}
              icon={<ArrowUpIcon/>} 
              onClick={() => (
                onToggle(),
                setChecked(!checked)
              )}
            />
          )}
        </Tooltip>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Divider />
          <Box
            p="20px"
            color="black"
            m="4"
            
            rounded="md"
          >
            {details}
          </Box>
        </Collapse>
    </Box>
  )
}

const EHRPatientTable = (props) => {
  const {ehrs} = props;

  return (
    <>
      {ehrs.map((row, index) => {
        return (
          <EHRPatientView key={index}
            index={ehrs.length - index}
            details={row.details}
            provider={row.provider}
            attachement={row.attachement}
            date={row.date}
            time={row.time}
          />
        );
      })}
    </>

  )
}

const ContractInfo = (props) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {account} = useWeb3React();
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

const InfoPanel = (props) => {
  const {active, account} = useWeb3React();
  const {verified, ...InfoProps} = props;
  const {onOpen:onDrawerOpen, isOpen:isDrawerOpen, onClose:onDrawerClose} = useDisclosure();
  const {isOpen:isEHROpen, onToggle:onEHRToggle} = useDisclosure();
  const contract = useContract(CONTRACT_ADDRESS, abi.abi);
  const { register, handleSubmit, control} = useForm();
  
  const [patientInfo, setPatientInfo] = useState("");

  const [lock, setLock] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const toast = useToast();
  const [updateView, setUpdateView] = useState(false);

  const [placeholderDOB, setplaceholderDOB] = useState("01/01/2000");
  const [placeholderPolicy, setplaceholderPolicy] = useState("123456");
  const [ehrs, setEHR] = useState([]);

  const hoverCSS = {
    border: "1px",
    borderStyle: "solid",
    borderColor: "blue.400",
  }

  const onSubmit = async (data) => {
    setPatientInfo(JSON.stringify(data));
    const cryptedData = encryptData(JSON.stringify(data), 'password');
    const result = await addToIPFS(cryptedData.toString());
    let EHRhash = getBytes32FromIpfsHash(result.path);
    try {
      const tx = await contract.createDefaultEHR(EHRhash, {gasLimit:300000});
      contract.on('CreateEHR', (from) => {
        console.log("✅ Event received");
        toast({
          title:"EHR Added!",
          description: `Your Personal Info has been added`,
          status: "success",
          duration: 10000,
          isClosable: true,
        });
      });
      await tx.wait();
      setUpdateView(true);
      console.log("✅ Tx successful");
      onDrawerOpen();
      
    } catch (e){
      console.log(e);
      let message = e.data && e.data.message ? e.data.message : e.error && JSON.parse(JSON.stringify(e.error)).body ? JSON.parse(JSON.parse(JSON.stringify(e.error)).body).error.message : e.data ? e.data : JSON.stringify(e);
      if(!e.error && e.message){
        message = e.message
      }
      toast({
        title:"Not Updated!",
        description: `${JSON.parse(message).error.message}`,
        status: "error",
        duration: 10000,
        isClosable: true,
        });
    }
  }

  const handleLocking = () => {
    setLock(!lock);
  };

  const getEHR = async (contract) => {
    try {
      const tx = await contract.getOwnRecords();
      const zip = (a, b, c, d, e) => a.map((k, i) => [k, b[i], c[i], d[i], new Date(e[i] * 1000).toLocaleDateString("en-US"), new Date(e[i] * 1000).toLocaleTimeString('en-US')]);
      const structure = zip(tx._accessKeys, tx._encryptHash, tx._encryptFileHash, tx._issuers, tx._dates)
      const fetchedEHR = await structure;
      await Promise.all(
        fetchedEHR.map(async (item, index) => {
          const report =  await decryptEHR(item[1]);
          
          let attachementCondition = (item[2] != "0x0000000000000000000000000000000000000000000000000000000000000000");
          var url = null;
          if (attachementCondition) {
            let bufferHash = getIPFSHashFromBytes32(item[2]);
            var url = `https://${IPFS_GATEWAY}/ipfs/${bufferHash}`;
          }
          if (index === 0){
            let parsed = JSON.parse(report);
            let syntax = `DOB : ${parsed.dob}\n Insurance PolicyNumber : ${parsed.policyNumber}`;
            setEHR(currentEHR => [ 
              {
                hash:item[1],
                details:syntax,
                provider:item[3],
                attachement:url,
                date:item[4],
                time:item[5]
              }, ...currentEHR
            ])
          } else {
            setEHR(currentEHR => [ 
              {
                hash:item[1],
                details:report,
                provider:item[3],
                attachement:url,
                date:item[4],
                time:item[5]
              }, ...currentEHR
            ])
          }
        }));
      
      if (fetchedEHR.length >= 1){
        const genesisEHRDetails = JSON.parse(await decryptEHR(fetchedEHR[0][1]));
        setplaceholderDOB(genesisEHRDetails.dob);
        setplaceholderPolicy(genesisEHRDetails.policyNumber);
      }

    } catch (error) {
      setTimeout(() => ( 
        toast({
          title:"No Genesis EHR provided!",
          description: `You need to fill in information inside personal panel`,
          status: "warning",
          duration: 10000,
          isClosable: true,
        })
        , 3000))
      throw error;
    }
  };


  useEffect(() => {
    if (active && account){
      console.log('get ehrs');
      getEHR(contract);
    }
    
  }, [active, updateView])

  return (
    <Box 
      m={8}
      maxW={'400px'}
      w={'full'}
      minH={'10vh'}
      h = {"auto"}
      bg='white'
      boxShadow={'2xl'}
      rounded={'md'}
    >
      <Box p={4}>
        {account && active && verified ? (
          <Flex direction="row" alignItems="center">
            <Identicon account={account} size={50}/>
            <Heading mx={5} size="lg">{InfoProps.patient.name}</Heading>
            <Tooltip label="See your EHR" placement="top">
              <IconButton 
                size="sm" 
                ml={2}
                // isDisabled={disableView}
                icon={<ViewIcon/>} 
                onClick={onDrawerOpen}
                _hover = {hoverCSS}/>
            </Tooltip>
            <Drawer
              isOpen={isDrawerOpen}
              placement="right"
              onClose={onDrawerClose}
              size={"lg"}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth="1px">
                  Electronic Health Record History 
                </DrawerHeader>
                <DrawerBody>
                  <EHRPatientTable ehrs={ehrs}/>
                </DrawerBody>
                <DrawerFooter borderTopWidth="1px">
                  <Button variant="outline" mr={3} onClick={onDrawerClose}>
                    Cancel
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <Tooltip label="See more info" placement="top">
              {!expanded ? (
                <IconButton 
                  size="sm" 
                  ml={2}
                  icon={<ArrowDownIcon/>} 
                  onClick={() => (
                    onEHRToggle(),
                    setExpanded(!expanded)
                    )}
                  />
              ):(
                <IconButton 
                  size="sm" 
                  ml={2}
                  icon={<ArrowUpIcon/>} 
                  onClick={() => (
                    onEHRToggle(),
                    setExpanded(!expanded)
                  )}
                />
              )}
            </Tooltip>
          </Flex>
        ):(
          <Heading size="lg" >{InfoProps.title}</Heading>
        )}
      </Box>
      <Collapse in={isEHROpen} animateOpacity>
        <Divider />
        <Box
          p="20px"
          color="black"
          m="4"
          rounded="md"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid justifySelf="start" alignSelf="center" templateColumns="repeat(5, 1fr)" gap={4}>
              <GridItem colSpan={1} h="10">
                <Text> DOB : </Text>
              </GridItem>
              <GridItem colStart={4} colEnd={6} h="10">
              <Controller
                control={control}
                name="dob"
                render={({ field }) => (
                  <Input
                    id="dob"
                    isDisabled={!lock}
                    placeholder={placeholderDOB}
                    {...register("dob",{
                      required: "This is required"})}
                    />
                  )}
                />
              </GridItem>
            </Grid>
            <Grid justifySelf="start" alignSelf="center" templateColumns="repeat(5, 1fr)" gap={0}>
              <GridItem colStart={1} colEnd={3} h="10">
                <Text> Policy Number :</Text>
              </GridItem>
              <GridItem colStart={3} colEnd={6} h="10">
                <InputGroup>
                  <InputLeftAddon children="#" />
                  <Controller
                    control={control}
                    name="policyNumber"
                    render={({ field }) => (
                      <Input
                        id="number"
                        placeholder={placeholderPolicy}
                        isDisabled={!lock}
                        {...register("policyNumber",{
                          required: "This is required"})}
                        />
                      )}
                    />
                </InputGroup>
              </GridItem>
            </Grid>
          <Flex direction="row" alignSelf="center">
            {!lock ? (
              <IconButton 
                size="sm" 
                ml={2}
                icon={<LockIcon/>} 
                type="submit"
                onClick={() => setLock(!lock)}
              />  
            ):(
              <IconButton 
                size="sm" 
                ml={2}
                icon={<UnlockIcon/>} 
                onClick={()=> handleLocking()}
              />
            )}
          </Flex>
          </form>
        </Box>
      </Collapse>
    </Box>
  )
}

const Tables = (props) => {
  const textColor = useColorModeValue("gray.700", "white");
  const {participants} = props;
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
              type="patientTools"
            />
          );
        })}
      </Tbody>
    </Table>
  )
}

const FunctionPanel = (props) => {
  const {active, account} = useWeb3React();
  const {verified, participants, ...rest} = props;

  return (
    <Box 
      m={8}
      maxW={'70%'}
      w={'60%'}
      minH={'80vh'}
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'2xl'}
      rounded={'md'}
    >
      <Flex m={10} direction="row">
        <Heading > {rest.title} </Heading>
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
            <Tables participants={participants}/>
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

const Patient = () => {
  const contract = useContract(CONTRACT_ADDRESS, abi.abi);
  const {active, account, deactivate} = useWeb3React();
  const [owner, setOwner] = useState();
  const [patientName, setPatientName] = useState();
  
  const {verified, verifyAccount, error} = useVerifyAccount(contract, account, "patient");
  const {errorNetwork} = useAppContext();
  const [allDoctors, setAvailableDoctors] = useState([]);
  const toast = useToast();

  const getOwner = async (contract) => {
    try {
      const owner = await contract.owner();
      setOwner(owner);
    } catch (e) {
      console.log('error', e);
    }
  }

  const getInfo = async (contract) => {
    try {
      const info = await contract.getPatientDisplayInfo(account);
      setPatientName(info.name);
    } catch (e) {
      console.log('error', e);
    }
  }

  const getAllDoctors = useCallback(async (contract) => {
    try {
      var network = await contract.getDoctorList();
      console.log(network);
      for (let i = 0; i<network.length; i++){
        const info = await contract.getDoctorInfo(network[i]);
        const [permRead, permWrite] = await contract.getPermissions(account, network[i]);
        setAvailableDoctors(currentProfile => [...currentProfile,
          {
            id: generate(),
            name: info.name,
            role: "doctor",
            address: info._address,
            statusR: permRead, 
            statusW: permWrite, 
            date: new Date(info.date * 1000).toLocaleDateString("en-US"),

          }
        ]);
      }
    } catch (error){
      console.log(error);
    }
  });

  useEffect(() => {
    if (active){
      console.log('Getting owner..');
      getOwner(contract);
      verifyAccount(contract, account, "patient");
      getInfo(contract);
      getAllDoctors(contract);
    }
  }, [active]);

  const InfoProps = {
    title : "My Info",
    patient : {
      name: patientName,
    },
  }

  return (
    <>
      <Header subtitle="Patient"/>
      <Layout>
        <VStack >
          <InfoPanel verified={verified} {...InfoProps}/>
          <ContractInfo error={error} verified={verified} title="Contract Details" address={contract.address} owner={owner}/>
        </VStack>
        <FunctionPanel title="Doctor Network" verified={verified} participants={allDoctors}/>
      </Layout>
    </>
    
  )
}
export default Patient;