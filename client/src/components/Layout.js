import { ReactNode } from "react";
import { Flex, Spacer, Grid, GridItem } from "@chakra-ui/react";

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      h="100vh"
      bg="gray.800"
    >
      {children}
    </Flex>
  );
}