import React, { useCallback, useState, useEffect, useRef} from 'react';
import {
  Button,
  ButtonGroup,
  Flex, 
  Text,
  Tooltip,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stat,
  StatLabel,
  StatNumber,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  useColorModeValue,
  useToast,
  Box,
  Textarea,
  Table, 
  Thead, 
  Tr,
  Td, 
  Th,
  Tbody,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Select,
} from "@chakra-ui/react"
import {CheckIcon, InfoOutlineIcon, ArrowForwardIcon, AttachmentIcon, EditIcon, CopyIcon} from '@chakra-ui/icons'
import { shortenAddress } from '../utils/shortenAddress';
import { useContract } from '../hooks/useContract';
import { CONTRACT_ADDRESS } from '../constant';
import { useWeb3React } from '@web3-react/core';
import abi from '../../../smart-contract/artifacts/contracts/MedicalBlock.sol/MedicalBlock.json';
import { Controller, useForm} from "react-hook-form";
import { encryptData, decryptData, getBytes32FromIpfsHash, getIPFSHashFromBytes32, decryptEHR, getFromIPFS, addToIPFS } from "../utils/encrypt-tools";

// import {initNotify} from '../hooks/useNotify';
// const notify = initNotify();


interface EHR {
  hash:String,
  details:String,
  provider:String,
  attachement:Boolean, 
  date:String,
  time:String
}

const TableEHRRow = (props) => {
  const {index, hash, details, provider, attachement, date, time} = props;
  const textColor = useColorModeValue("gray.600", "white");

  return (
    <Tr>
      <Td maxWidth={{ sm: "30px", md:"30px" }} pl="0px">
        <Flex align="left" py=".8rem" minWidth="90%" flexWrap="nowrap">
          <Text
            fontSize="md"
            color={textColor}
            fontWeight="normal"
          >
            {index}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Flex direction="column" alignItems="center">
          <Text fontSize="sm" color="gray.400" fontWeight="normal">
            {shortenAddress(hash, 4)}
          </Text>
        </Flex>
      </Td>
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="normal" pb=".5rem">
          {details}
        </Text>
      </Td>
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="normal" pb=".5rem">
        {shortenAddress(provider, 5)}
        </Text>
      </Td>
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="normal" pb=".5rem">
        {date}
        </Text>
      </Td>
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="normal" pb=".5rem">
        {time}
        </Text>
      </Td>
      <Td>
        {attachement ? (
          <IconButton 
            size="sm" 
            ml={2}
            icon={<AttachmentIcon/>}
            />
        ):(
          null
        )}
      </Td>
    </Tr>
  );
}

const PatientInfo = (props) => {
  const {name, address, patientInfo} = props;
  return (
    <Flex direction="column">
      <Flex 
        direction="row" 
        m="5">
        <Stat>
          <StatLabel>First Name</StatLabel>
          <StatNumber>{name.split(" ")[0]}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Last Name</StatLabel>
          <StatNumber>{name.split(" ")[1]}</StatNumber>
        </Stat>
      </Flex>
      <Flex 
        direction="column"
        m="5">
        <Stat>
          <StatLabel>Address</StatLabel>
          <StatNumber >{address}</StatNumber>
        </Stat>
      </Flex >
      {patientInfo ? (
        <Flex 
          direction="column"
          m="5">
          <Stat pb="5">
            <StatLabel>Date of Birth</StatLabel>
            <StatNumber>{patientInfo.dob}</StatNumber>
          </Stat>
          <Stat pb="5">
            <StatLabel>Policy Number</StatLabel>
            <StatNumber>{patientInfo.policyNumber}</StatNumber>
          </Stat>
        </Flex>
      ):(
        <Flex>
          <Box mx={6} mb={2}>
            <Text color="gray.600" >Patient hasn't provided initial EHR</Text>
          </Box>
        </Flex>
      )}
      </Flex>
  )
}

const EHRTable = (props) => {
  const {ehrs} = props;
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Table variant="simple" color={textColor}>
      <Thead>
        <Tr my=".8rem" pl="0px" color="gray.400">
          <Th pl="0px" color="gray.400">#</Th>
          <Th color="gray.400">Hash</Th>
          <Th color="gray.400">Details</Th>
          <Th color="gray.400">Provider</Th>
          <Th color="gray.400">Date</Th>
          <Th color="gray.400">Time</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {ehrs.map((row, index) => {
          return (
            <TableEHRRow key={index}
              index={ehrs.length - index}
              hash={row.hash}
              details={row.details}
              provider={row.provider}
              attachement={row.attachement}
              date={row.date}
              time={row.time}
            />
          );
        })}
      </Tbody>
    </Table>

  )
}

export const ReadDrawer = (props) => {
  const {onOpen, isOpen, onClose} = useDisclosure();
  const {name, address, hoverCSS, ...rest} = props;
  const contract = useContract(CONTRACT_ADDRESS, abi.abi);

  const [patientInfo, setPatientInfo] = useState(null);

  const readPatientInfoEHR = async () => {
    try {
      const tx = await contract.getRecordIdx(address, 0);
      const report =  JSON.parse(await decryptEHR(tx.encryptHash));
      setPatientInfo({
        dob: report.dob,
        policyNumber: report.policyNumber,
      })
    } catch (e){
      console.log(e);
    }
  }

  useEffect(() => {
    if (isOpen){
      readPatientInfoEHR();
    }
  }, [isOpen])

  return (
    <>
      <Tooltip label="Read Info" placement="top">
        <IconButton 
          size="sm" 
          ml={2} 
          onClick={onOpen}
          icon={<InfoOutlineIcon/>} 
          _hover={hoverCSS}/>
      </Tooltip>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        size={"md"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {name}'s Information
          </DrawerHeader>
          <DrawerBody>
            <PatientInfo name={name} address={address} patientInfo={patientInfo}/>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export const EditDrawer = (props) => {
  const {onOpen:onDrawerOpen, isOpen:isDrawerOpen, onClose:onDrawerClose} = useDisclosure();
  const {onOpen:onEHROpen, isOpen:isEHROpen, onClose:onEHRClose} = useDisclosure();
  const {name, address, hoverCSS, statusW, doctorProps} = props;
  const { register, handleSubmit} = useForm();
  const {active, account} = useWeb3React();

  const [scrollBehavior, setScrollBehavior] = useState("inside");
  const [allEHRs, setEHR] = useState<EHR[]>([]);
  const [report, setReport] = useState("");
  // const [addRights, setAddRights] = useState(true);
  const [ ipfsHash, setIpfsHash ] = useState();
  const [ ipfsContents, setIpfsContents ] = useState();
  const toast = useToast();

  const initialRef = React.useRef();
  const contract = useContract(CONTRACT_ADDRESS, abi.abi);


  async function onSubmit(){
    try {
      console.log("📡 sending EHR to IPFS...");
      // Could fall back to going directly to IPFS if server is down 
      const cryptedData = encryptData(report, 'password');
      console.log(cryptedData);
      const result = await addToIPFS(cryptedData.toString());
      
      setIpfsHash();
      setIpfsContents();
      if(result && result.path) {
          setIpfsHash(result.path)
      }
      let bufferIPFS = getBytes32FromIpfsHash(result.path);
      console.log('bufferIPFS', bufferIPFS);
      // Interact with contract 
      const tx = await contract.updateEHR(address, bufferIPFS, {gasLimit:300000})
      contract.on('UpdatedEHR', (patientAddress, doctorAddress, EHRhash) => {
        console.log("✅ Event received");
        setEHR(currentEHR => [ 
          {
            hash:bufferIPFS,
            details:report,
            provider:doctorProps.doctor.address,
            attachement:false,
            date:new Date().toLocaleDateString("en-US"),
            time:new Date().toLocaleTimeString('en-US')
          }, ...currentEHR
        ])
        toast({
          title:"EHR Updated!",
          description: `You updated the EHR of ${patientAddress}`,
          status: "success",
          duration: 10000,
          isClosable: true,
        });
      });
      // notify user of transaction ongoing
      // const { emitter } = notify.hash(tx.hash);
      // emitter.on("all", transaction => {
      //   return {
      //     onclick: () => window.open("https://rinkeby.etherscan.io/tx/" + transaction.hash),
      //   };
      // });

      onEHRClose();
      await tx.wait();
      console.log("✅ Tx successful");
      
      
    } catch (e){
      let message = e.data && e.data.message ? e.data.message : e.error && JSON.parse(JSON.stringify(e.error)).body ? JSON.parse(JSON.parse(JSON.stringify(e.error)).body).error.message : e.data ? e.data : JSON.stringify(e);
      toast({
        title:"EHR Not Updated!",
        description: `${JSON.parse(message).error.message}`,
        status: "error",
        duration: 10000,
        isClosable: true,
        });
    }

  }

  function handleChange(event){
    setReport(event.target.value);
  }

  const getEHRsPatients = async (address) => {
    try {
      const tx = await contract.getRecords(address, {gasLimit:800000})
      const zip = (a, b, c, d) => a.map((k, i) => [k, b[i], c[i], new Date(d[i] * 1000).toLocaleDateString("en-US"), new Date(d[i] * 1000).toLocaleTimeString('en-US')]);
      const structure = zip(tx._accessKeys, tx._encryptHash, tx._issuers, tx._dates)
      return structure;
    } catch (e){
        console.log(e);
        throw e;
    }
  }

  const displayEHR = async (structure) => {
    try {
      const fetchedEHR = await structure;
      await Promise.all(
        fetchedEHR.map(async (item, index) => {
          const report =  await decryptEHR(item[1]);
          console.log(index, report);
          if (index === 0){
            let parsed = JSON.parse(report);
            let syntax = `DOB : ${parsed.dob}\n Insurance PolicyNumber : ${parsed.policyNumber}`;
            setEHR(currentEHR => [ 
              {
                hash:item[1],
                details:syntax,
                provider:item[2],
                attachement:false,
                date:item[3],
                time:item[4]
              }, ...currentEHR
            ])
          } else {
            setEHR(currentEHR => [ 
              {
                hash:item[1],
                details:report,
                provider:item[2],
                attachement:false,
                date:item[3],
                time:item[4]
              }, ...currentEHR
            ])
          }
        }));

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  useEffect(async () => {
    if (active){
      console.log('retrieve EHRs of patient')
      const structure = getEHRsPatients(address);
      displayEHR(structure);
    }
  }, [active])


  return (
    <>
      <Tooltip label="Update EHR" placement="top">
        <IconButton 
          size="sm" 
          ml={2}
          onClick={onDrawerOpen} 
          icon={<EditIcon/>}
          _hover={hoverCSS}/>
      </Tooltip>
      <Drawer
        isOpen={isDrawerOpen}
        placement="left"
        onClose={onDrawerClose}
        size={"full"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Update {name} 's EHR 
          </DrawerHeader>
          <DrawerBody>
            <EHRTable ehrs={allEHRs}/>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <ButtonGroup mt={4} spacing={4}>
              <Button 
                colorScheme="blue" 
                type="submit"
                onClick={onEHROpen}
                isDisabled={!statusW}
              >
                Add EHR
              </Button>
              <Modal 
                initialFocusRef={initialRef}
                isOpen={isEHROpen} 
                onClose={onEHRClose} 
                isCentered 
                size="xl"
                scrollBehavior={scrollBehavior}
              >
                <ModalOverlay />
                <ModalContent
                  background="white"
                  border="1px"
                  borderStyle="solid"
                  borderColor="gray.700"
                  borderRadius="3xl"
                >
                  <ModalHeader color="black" px={4} fontSize="lg" fontWeight="medium">
                    Create new Electronic Health Report
                  </ModalHeader>
                  <ModalCloseButton
                    color="black"
                    fontSize="sm"
                    _hover={{
                      color: "gray.700",
                    }}
                  />
                  <ModalBody pt={0} px={4}>
                    <Flex align="center" py=".8rem" minWidth="90%" flexWrap="nowrap">
                      <Text
                        fontSize="md"
                        // color={textColor}
                        fontWeight="normal"
                        minWidth="20%"
                      >
                        From :
                      </Text>
                      <Flex direction="column">
                        <Text fontSize="md" fontWeight="bold"> {doctorProps.doctor.name} </Text>
                        <Text fontSize="sm" color="gray.400" fontWeight="normal">
                          {doctorProps.doctor.address}
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex align="center" py=".8rem" minWidth="90%" flexWrap="nowrap">
                      <Text
                        fontSize="md"
                        fontWeight="normal"
                        minWidth="20%"
                      >
                        To :
                      </Text>
                      <Flex direction="column">
                        <Text fontSize="md" fontWeight="bold"> {name} </Text>
                        <Text fontSize="sm" color="gray.400" fontWeight="normal">
                          {address}
                        </Text>
                      </Flex>
                    </Flex>
                    <Textarea ref={initialRef} value={report} onChange={handleChange} minH={"250px"} color="black" placeholder="Write report..." />
                    <Flex m="5" direction="row" align="center">
                      <form onSubmit={handleSubmit((data) => alert(JSON.stringify(data)))}>
                        <input {...register('file')} type="file" name="file" multiple/>
                      </form>
                    </Flex>
                    
                    <ButtonGroup my={5} spacing={4}>
                      <Button
                        colorScheme="blue" 
                        type="submit"
                        onClick={onSubmit}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onEHRClose}
                      >
                        Cancel
                      </Button>
                    </ButtonGroup>
                  </ModalBody>
                </ModalContent>
              </Modal>
              <Button
                variant="outline"
                onClick={onDrawerClose}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export const TransferModal = (props) => {
  const {address, hoverCSS, doctorProps} = props;
  const {onOpen, isOpen, onClose} = useDisclosure();
  const cancelRef = useRef()
  const { register, handleSubmit, control} = useForm();
  const [selected, setSelected] = useState();
  const [isLoading, setLoading] = useState(false);
  const contract = useContract(CONTRACT_ADDRESS, abi.abi);
  const toast = useToast();
  
  const onSubmit = async (data) => {
    setSelected(JSON.stringify(data));
    try {
      setLoading(!isLoading);
      console.log("📡 Transfering access to another doctor...");
      const tx = await contract.grantAccessDocToDoc(address, data.selected);
      contract.on('AccessGranted', (account, doctorAddress) => {
        console.log("✅ Event received");
        toast({
          title:"Access Granted!",
          description: `You granted READ access to the ${doctorAddress}`,
          status: "success",
          duration: 10000,
          isClosable: true,
        });
      });
      await tx.wait();
      console.log("✅ Tx successful");
      setLoading(!isLoading);
      onClose();
    
    } catch (e) {
      let message = e.data && e.data.message ? e.data.message : e.error && JSON.parse(JSON.stringify(e.error)).body ? JSON.parse(JSON.parse(JSON.stringify(e.error)).body).error.message : e.data ? e.data : JSON.stringify(e);
      console.log(JSON.parse(message).error.message);
      toast({
          title:"Transfer not successful!",
          description: `${JSON.parse(message).error.message}`,
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      setLoading(false);
    }
  }


  return (
    <>
      <Tooltip label="Forward access" placement="top">
        <IconButton 
          size="sm" 
          ml={2} 
          onClick={onOpen} 
          icon={<ArrowForwardIcon/>}
          _hover={hoverCSS}/>
      </Tooltip>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Transfer Access to other doctor
              </AlertDialogHeader>
                <AlertDialogBody>
                  <Controller
                    control={control}
                    name="dob"
                    render={({ field }) => (
                      <Select key="0" placeholder="Select Doctor Address ..." {...register("selected")}> 
                        {doctorProps.network.allDoctors.filter((c) => c !== doctorProps.doctor.address).map((item, index) => {
                          return (
                              <option key={index} value={item}>
                                {item}
                              </option>
                          )
                        })}
                      </Select>
                    )}
                  />
                </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => {setLoading(false); onClose()}}>
                  Cancel
                </Button>
                <Button 
                  colorScheme="green" 
                  type="submit" 
                  isLoading={isLoading}
                  ml={3}>
                  Transfer Access
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </form>
      </AlertDialog>
    </>
  )
}
