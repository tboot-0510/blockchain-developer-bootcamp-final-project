import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
  Spacer
} from '@chakra-ui/react';
import ConnectButton from './ConnectButton';

export const ProfileTab = ({title, userID}) => {
  return (
    <Box
      m={8}
      maxW={'270px'}
      w={'full'}
      h={'50vh'}
      bg={useColorModeValue('white', 'gray.800')}
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
        </Stack>

        {/* <Stack direction={'row'} justify={'center'} spacing={6}>
          <Stack spacing={0} align={'center'}>
            <Text fontWeight={600}>23k</Text>
            <Text fontSize={'sm'} color={'gray.500'}>
              Followers
            </Text>
          </Stack>
          <Stack spacing={0} align={'center'}>
            <Text fontWeight={600}>23k</Text>
            <Text fontSize={'sm'} color={'gray.500'}>
              Followers
            </Text>
          </Stack>
        </Stack> */}

        <Button
          w={'full'}
          mt={8}
          bg={useColorModeValue('#151f21', 'gray.900')}
          color={'white'}
          rounded={'md'}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          }}>
          Connect now
        </Button>
        <Button
          w={'full'}
          mt={4}
          bg={useColorModeValue('#f0f8ff', 'blue.900')}
          color={'black'}
          rounded={'md'}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          }}>
          Register now
        </Button>
        {/* <ConnectButton /> */}
      </Box>
    </Box>
  );
}


// export default function Profiles() {
//   return (
//     <Box>
//       <Flex 
//         justify={"center"}
//         direction={{ base: "column-reverse", md: "row" }}
//         wrap="wrap"
//         minH="auto"
//         px={5}
//       >
//         <ProfileTab title="admin" userID="admin" />
//         <ProfileTab title="patient A" userID="patient_A" />
//         <ProfileTab title="patient B" userID="patient_B" />
//         <ProfileTab title="doctor A" userID="doctor_A" />
//         <ProfileTab title="doctor B" userID="doctor_B" />        
//       </Flex>
//     </Box>
//   )
// }