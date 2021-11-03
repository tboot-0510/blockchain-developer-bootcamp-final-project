import React, {useState, useEffect} from 'react';
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

export default function LandingSet(){
  const [allProfiles, setProfiles] = useState<User[]>([
    { id: "0", name: "admin", role: "admin" },
    { id: "1", name: "Doctor", role: "doctor" },
    { id: "2", name: "Patient", role: "patient" },
  ]);

  return (
    <Flex 
      direction="row"
      wrap="wrap"
    >
      <Flex className='display_users' >
        {allProfiles ? allProfiles.map((item, index) => <ProfileTab key={index} title={item.name} userID={item.role}/>) :""}
      </Flex>
    </Flex>
  )
};
