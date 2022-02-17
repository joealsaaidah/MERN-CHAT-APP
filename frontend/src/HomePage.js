import React, { useEffect } from "react";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      navigate("/chats");
    }
  }, [navigate]);
  return (
    <Container maxw='xl' centerContent>
      <Box
        d='flex'
        justifyContent='center'
        p={3}
        bg='white'
        w='100%'
        m={"40px 0 15px 0"}
        borderRadius='lg'
        borderWidth='1px'
      >
        <Text
          textAlign='center'
          fontSize='4xl'
          fontFamily='work sans'
          color='black'
        >
          MIMICUCU CHATING APP
        </Text>
      </Box>
      <Box
        color='black'
        bg='white'
        w='100%'
        p={4}
        borderRadius='lg'
        borderWidth='1px'
      >
        <Tabs variant='soft-rounded'>
          <TabList mb='1em'>
            <Tab width='50%'>Login</Tab>
            <Tab width='50%'>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
