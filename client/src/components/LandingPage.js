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

import { ProfileTabLandingPage } from './Profiles';

interface User {
  id: string;
  name: string;
  role: string;
  page: String;
}

export default function LandingSet(){
  const [allProfiles, setProfiles] = useState([
    { id: "0", name: "Admin", role: "admin", page: "/admin"},
    { id: "1", name: "Doctor", role: "doctor", page: "/doctor" },
    { id: "2", name: "Patient", role: "patient", page: "/patient"},
  ]);

  return (
    <Flex 
      direction="row"
      wrap="wrap"
    >
      <Flex className='display_users' >
        {allProfiles ? allProfiles.map((item, index) => <ProfileTabLandingPage key={index} title={item.name} userID={item.role} pageID={item.page}/>) :""}
      </Flex>
    </Flex>
  )
};
