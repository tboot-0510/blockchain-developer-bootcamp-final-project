import React, {useState} from "react";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useDisclosure,
  Input,
  Select,
  Alert,
  AlertIcon,
  AlertTitle
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";

import validate from "./validate";
import { useWeb3React } from "@web3-react/core";

const options = [
  // { value: 'admin', label: 'Admin' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'patient', label: 'Patient' },

];

const FormApp = ({id, onSubmit}) => {
  const { register, handleSubmit, control, watch, reset, formState: { errors, isSubmitting } } = useForm();
  const {active} = useWeb3React();
  const {onClose} = useDisclosure();

  return (
    <Box w={"full"} p={4} m="10px auto">
      {!active && <Alert status="error">
                    <AlertIcon />
                    <AlertTitle mr={2}>Not connected to Metamask</AlertTitle>
                  </Alert>}
      <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.name}>
        <FormLabel mt={4} htmlFor="firstname-div">First Name</FormLabel>
          <Controller
            control={control}
            name="firstname"
            render={({ field }) => (
              <Input
                id="firstname"
                placeholder="First Name"
                {...register("firstname", {
                  required: "This is required",
                  minLength: { value: 3, message: "Minimum length should be 3" }
                })}
              />
            )}
          />
        <FormLabel mt={4} htmlFor="lastname-div"> Last Name</FormLabel>
          <Controller
            control={control}
            name="lastname"
            render={({ field }) => (
              <Input
                id="lastname"
                placeholder="Last Name"
                {...register("lastname", {
                  required: "This is required",
                  minLength: { value: 3, message: "Minimum length should be 3" }
                })}
              />
            )}
          />
        <FormLabel mt={4} htmlFor="select-div"> Select Role</FormLabel>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select
                id="role"
                placeholder="Select role ..."
                {...register("role", {
                  required: "This is required",
                })}
              >
                {options.map((item, index) => (
                  <option key={index} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
            )}
          />
        <FormLabel mt={4} htmlFor="address-div"> ETH Address</FormLabel>
          <Controller
            control={control}
            name="lastname"
            render={({ field }) => (
              <Input
                id="address"
                placeholder="ETH Address"
                {...register("address", {
                  required: "This is required",
                  // minLength: { value: 42, message: "Minimum length should be 3" }
                })}
              />
            )}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <ButtonGroup mt={4} spacing={4}>
          <Button 
            isLoading={isSubmitting}
            colorScheme="blue" 
            loadingText="Submitting"
            type="submit"
            onClick={onClose}
            disabled={!active}
          >
            Submit
          </Button>
          <Button
            variant="outline"
            onClick={() => reset()}
            isDisabled={isSubmitting}
          >
            Reset
          </Button>
        </ButtonGroup>
      </form>
    </Box>
  )
};

export default FormApp;