import {
  Flex, 
  Avatar, 
  Td,
  Text,
  Tr,
  Button,
  Tooltip,
  Circle,
  IconButton,
  useColorModeValue,
  useClipboard,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react"
import {CheckIcon, CopyIcon, CloseIcon} from '@chakra-ui/icons'
import { shortenAddress } from '../utils/shortenAddress';
import {ReadDrawer, EditDrawer, TransferModal} from './DoctorTools'
import Identicon from "../components/IdentityIcon";
import React, {useState, useRef, useEffect} from 'react';
import { useContract } from "../hooks/useContract";
import { CONTRACT_ADDRESS } from "../constant";
import abi from '../contracts/MedicalBlock.sol/MedicalBlock.json';
import { useWeb3React } from "@web3-react/core";

const PatientTools = (props) => {  
  return (
    <Flex direction="row">
      <GrantAccess address={props.address} status={props.status} callbackFn={props.callbackGrantFn}/>
      <RevokeAccess address={props.address} status={props.status} callbackFn={props.callbackRevokeFn}/>
    </Flex>
  )
}

const DoctorTools = (props) => {
  return (
    <>
      {props.status.statusR ? (
        <Flex direction="row">
          <ReadDrawer name={props.name} address={props.address} hoverCSS={props.hoverCSS} />
          <EditDrawer name={props.name} address={props.address} hoverCSS={props.hoverCSS} statusW={props.status.statusW} doctorProps={props.doctorProps}/>
          <TransferModal address={props.address} hoverCSS={props.hoverCSS} doctorProps={props.doctorProps}/>
        </Flex>
      ):(
        null
      )}
    </>
  )
}

const GrantAccess = (props) => {
  const {onOpen, isOpen, onClose} = useDisclosure();
  const cancelRef = useRef()
  const toast = useToast();
  const {account} = useWeb3React();
  const contract = useContract(CONTRACT_ADDRESS, abi.abi)
  const [isLoading, setLoading] = useState(false);

  async function handleAccess(){
    try {
      setLoading(!isLoading);
      const tx = await contract.grantAccess(props.address);
      contract.on('AccessGranted', (account, doctorAddress) => {
        console.log("✅ Event received");
        toast({
          title:"Access Granted!",
          description: `You granted access to ${doctorAddress}`,
          status: "success",
          duration: 10000,
          isClosable: true,
        });
      });
      await tx.wait();
      console.log("✅ Tx successful");
      setLoading(!isLoading);
      onClose();
      props.callbackFn(true);

    } catch (e){
      let message = e.data && e.data.message ? e.data.message : e.error && JSON.parse(JSON.stringify(e.error)).body ? JSON.parse(JSON.parse(JSON.stringify(e.error)).body).error.message : e.data ? e.data : JSON.stringify(e);
      setLoading(false);
      toast({
        title:"Access Not Granted!",
        description: `${JSON.parse(message).error.message}`,
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    }
  }

  return (
    <>
      <Tooltip label="Grant access to doctor" placement="top">
        <IconButton 
          size="sm" 
          ml={2} 
          onClick={onOpen}
          disabled={props.status.statusW}
          icon={<CheckIcon/>} 
          _hover={{
            border: "1px",
            borderStyle: "solid",
            color:"white",
            backgroundColor: "green"
          }}/>
      </Tooltip>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Grant Access to Doctor
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? The doctor will have access to your EHR files.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="green" 
                isLoading={isLoading}
                onClick={handleAccess} 
                ml={3}>
                Allow Access
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

const RevokeAccess = (props) => {
  const {onOpen, isOpen, onClose} = useDisclosure();
  const cancelRef = useRef()
  const contract = useContract(CONTRACT_ADDRESS, abi.abi)
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  async function handleRevokeAccess(){
    try {
      setLoading(!isLoading);
      const tx = await contract.revokeAccess(props.address, {gasLimit:300000});
      contract.on('AccessRevoked', (account, doctorAddress) => {
        console.log("✅ Event received");
        toast({
          title:"Access Revoked!",
          description: `You revoked access to ${doctorAddress}`,
          status: "success",
          duration: 10000,
          isClosable: true,
        });
      });
      await tx.wait();
      console.log("✅ Tx successful");
      setLoading(!isLoading);
      onClose();
      props.callbackFn(false);
      
    } catch (e){
      let message = e.data && e.data.message ? e.data.message : e.error && JSON.parse(JSON.stringify(e.error)).body ? JSON.parse(JSON.parse(JSON.stringify(e.error)).body).error.message : e.data ? e.data : JSON.stringify(e);
      setLoading(false);
      toast({
        title:"Access Not Revoked!",
        description: `${JSON.parse(message).error.message}`,
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    }
  }

  return (
    <>
      <Tooltip label="Revoke access to doctor" placement="top">
        <IconButton 
          size="sm" 
          ml={2} 
          onClick={onOpen}
          disabled={!props.status.statusR}
          icon={<CloseIcon/>} 
          _hover={{
            border: "1px",
            borderStyle: "solid",
            color:"white",
            backgroundColor: "red"
          }}/>
      </Tooltip>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Revoke Access to Doctor
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleRevokeAccess} 
                isLoading={isLoading}
                ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

const TablesTableRow = (props) => {
  const { logo, name, address, statusR, statusW, date, type, doctorProps} = props;
  const {hasCopied, onCopy} = useClipboard(address);
  const textColor = useColorModeValue("gray.700", "white");
  const [currentStatusR, setCurrentStatusR] = useState(!!statusR);
  const [currentStatusW, setCurrentStatusW] = useState(!!statusW);

  const callbackRevokeFn = status => {
    setCurrentStatusR(status);
    setCurrentStatusW(status);
  }

  const callbackGrantFn = status => {
    setCurrentStatusR(status);
    setCurrentStatusW(status);
  }

  const hoverCSS = {
    border: "1px",
    borderStyle: "solid",
    borderColor: "blue.400",
    backgroundColor: "blue.200",
  }

  const statusProps = {
    statusR: currentStatusR,
    statusW: currentStatusW,
  }

  function SwitchCase(props) {
    switch (props.view) {
      case ("doctorTools"):
        return <DoctorTools name={props.name} address={props.address} status={props.status} doctorProps={props.doctorProps}/>
      case ("patientTools"):
        return <PatientTools address={props.address} status={props.status} callbackRevokeFn={props.callbackRevokeFn} callbackGrantFn={callbackGrantFn}/>
      default :
        null();
    }
  }
  
  return (
    <Tr>
      <Td minWidth={{ sm: "250px" }} pl="0px">
        <Flex align="center" py=".8rem" minWidth="90%" flexWrap="nowrap">
          <Identicon account={address} size={40}/>
          <Flex direction="column">
            <Text
              fontSize="md"
              color={textColor}
              fontWeight="bold"
              minWidth="70%"
            >
              {name}
            </Text>
            <Flex direction="row" alignItems="center">
              <Text fontSize="sm" color="gray.400" fontWeight="normal">
                {shortenAddress(address, 10)}
              </Text>
              <IconButton 
                size="sm" 
                onClick={onCopy} 
                ml={2} 
                bg="transparent"
                icon={hasCopied ? <CheckIcon />: <CopyIcon />}
                _hover={hoverCSS}/>
            </Flex>
            
          </Flex>
        </Flex>
      </Td>
      <Td>
        <Flex direction="row" alignItems="center">
          {currentStatusR ? (
              <Circle align="center" size="25px" bg="green" color="white" mr="1">
                <CheckIcon/>
              </Circle>
            ):(
              <Circle align="center" size="25px" bg="gray.400" color="white" mr="1">
                <Tooltip label="No read access granted" placement="top">
                  <CheckIcon/>
                </Tooltip>
              </Circle>
          )}
          {currentStatusW ? (
              <Circle align="center" size="25px" bg="green" color="white" mr="1">
                <CheckIcon/>
              </Circle>
            ):(
              <Circle align="center" size="25px" bg="gray.400" color="white" mr="1">
                <Tooltip label="No write access granted" placement="top">
                  <CheckIcon/>
                </Tooltip>
              </Circle>
          )}
        </Flex>
      </Td>
      <Td>
        <Text fontSize="md" color={textColor} fontWeight="normal" pb=".5rem">
          {date}
        </Text>
      </Td>
      <Td>
        <SwitchCase view={type} name={name} address={address} status={statusProps} doctorProps={doctorProps} callbackRevokeFn={callbackRevokeFn} callbackGrantFn={callbackGrantFn}/>
      </Td>
    </Tr>
  );
}

export default TablesTableRow;