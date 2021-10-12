import React from 'react';
// import {Container, Button} from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import useEth from '../hooks/useEth';
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";

// const Balance = () => {
//   const {account} = useWeb3React();
//   const {fetchBalance, ethBalance} = useEth();

//   useEffect(() => {
//     if (account){
//       fetchBalance();
//     }
//   }, [account]);

//   return (
//     <Container>
//       <div>
//         <p style={{ color: "white"}}> ETH BALANCE : {ethBalance} </p>
//       </div>
//     </Container>
//   );
// };

type Props = {
  isOpen : any;
  onClose : any; 
}

const AccountModal = ({isOpen, onClose}: Props) => {
  const {account, deactivate} = useWeb3React();
  const {fetchBalance, ethBalance} = useEth();

  function handleDeactivateAccount(){
    deactivate();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent
        background="gray.900"
        border="1px"
        borderStyle="solid"
        borderColor="gray.700"
        borderRadius="3xl"
      >
        <ModalHeader color="white" px={4} fontSize="lg" fontWeight="medium">
          Account
        </ModalHeader>
        <ModalCloseButton
          color="white"
          fontSize="sm"
          _hover={{
            color: "whiteAlpha.700",
          }}
        />
        <ModalBody pt={0} px={4}>
          <Box
            borderRadius="3xl"
            border="1px"
            borderStyle="solid"
            borderColor="gray.600"
            px={5}
            pt={4}
            pb={2}
            mb={3}
          >
            <Flex justifyContent="space-between" alignItems="center" mb={3}>
              <Text color="gray.400" fontSize="sm">
                Connected with MetaMask
              </Text>
              <Button
                variant="outline"
                size="sm"
                borderColor="blue.800"
                borderRadius="3xl"
                color="blue.500"
                fontSize="13px"
                fontWeight="normal"
                px={2}
                height="26px"
                _hover={{
                  background: "none",
                  borderColor: "blue.300",
                  textDecoration: "underline",
                }}
                onClick={handleDeactivateAccount}
              >
                Disconnect
              </Button>
            </Flex>
            <Flex alignItems="center" mt={3} mb={5} lineHeight={1}>
              <Text
                color="white"
                fontSize="s"
                fontWeight="semibold"
                ml="2"
                lineHeight="1.1"
              >
                {account}
              </Text>
            </Flex>
          </Box>
          <Box
            borderRadius="3xl"
            border="1px"
            borderStyle="solid"
            borderColor="gray.600"
            px={5}
            pt={4}
            pb={2}
            mb={3}
          >
            <Flex justifyContent="space-between" alignItems="center" mb={3}>
              <Text color="gray.400" fontSize="sm">
              ETH Balance
              </Text>
            </Flex>
            <Flex alignItems="center" mt={3} mb={5} lineHeight={1}>
              <Text
                color="white"
                fontSize="s"
                fontWeight="semibold"
                ml="2"
                lineHeight="1.1"
              >
                {ethBalance}
              </Text>
            </Flex>
          </Box>
        </ModalBody>

        <ModalFooter
          justifyContent="end"
          background="gray.700"
          borderBottomLeftRadius="3xl"
          borderBottomRightRadius="3xl"
          p={6}
        >
          <Text
            color="white"
            textAlign="left"
            fontWeight="medium"
            fontSize="md"
          >
            Your transactions will appear here...
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AccountModal;