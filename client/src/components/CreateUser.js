import React, {useState, useEffect} from 'react';
import { useForm } from "react-hook-form";
import { generate } from "shortid";
import { produce } from "immer";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import { ProfileTab } from './Profiles';

interface User {
  id: string;
  name: string;
  role: string;
}

const FormUser = () => {
  const [allProfiles, setProfiles] = useState<User[]>([
    { id: "0", name: "admin", role: "admin" },
    { id: "1", name: "Hospital", role: "admin" },
    { id: "2", name: "Patient", role: "admin" },
  ]);
  const [valueSelect, setValueSelect] = useState("")
  const [valueName, setValueName] = useState("")

  const handleChangeSelect = (event) => {
    setValueSelect(event.target.value)
  }
  const handleChangeInput = (event) => {
    setValueName(event.target.value)
  }

  const { register, handleSubmit, formState: {isSubmitting } } = useForm();

  let profiles = []

  // function createUserToggle(info) {
  //   // Create user profile tab 'Profiles.js'
  //   profiles.push(info)
  //   setProfiles(allProfiles => [...allProfiles, profiles])
  // }

  const createUserToggle = (event) => {
    const name = valueName;
    const role = valueSelect;
    setProfiles(currentProfile => [...currentProfile,
      {
        id: generate(),
        name: name,
        role: role
      }
    ]);
  }
  return (
    <Flex 
      direction="row"
      wrap="wrap"
    >
      <Flex className='create_user'
        minH={'100vh'}
        direction={'row'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Create user to blockchain</Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <FormControl id="Name">
                <FormLabel>Name</FormLabel>
                <Text> {valueName} </Text>
                <Input 
                  type="Name"
                  value={valueName}
                  onChange={handleChangeInput}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Role</FormLabel>
                <Select 
                  value={valueSelect} 
                  onChange={handleChangeSelect} 
                  placeholder="Select role"
                >
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                </Select>
                <Text> {valueSelect} </Text>
              </FormControl>
              <Stack spacing={10}>
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  onClick={createUserToggle}
                  >
                  Create User
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
      <Flex className='display_users' >
        {allProfiles ? allProfiles.map((item, index) => <ProfileTab key={index} title={item.name} userID={item.role}/>) :""}
      </Flex>
    </Flex>
  )
};

export default function FormUserPage() {
  const [allProfiles, setProfiles] = useState([]);

  return (
    <FormUser/>
  );
}
