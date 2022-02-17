import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  toast,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFullInfo } from "../config/chatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();

  const toast = useToast();
  const { user, selectedChat, setSelectedChat } = ChatState();

  const sendMessageHandler = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        setNewMessage("");
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error",
          description: "failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      console.log("messages", messages);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "failed to load the messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const typingHandler = async (e) => {
    setNewMessage(e.target.value);
    // typing logic
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w='100%'
            fontFamily='Work sans'
            d='flex'
            justifyContent={{ base: "space-between" }}
            alignItems='center'
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderFullInfo(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            d='flex'
            flexDir='column'
            justifyContent='flex-end'
            p={3}
            bg='#E8E8E8'
            w='100%'
            h='100%'
            borderRadius='lg'
            overflowY='hidden'
          >
            {loading ? (
              <Spinner
                size='xl'
                w={20}
                h={20}
                alignSelf='center'
                margin='auto'
              />
            ) : (
              <div className='messages'>
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessageHandler} isRequired mt={3}>
              <Input
                variant='filled'
                bg='#E0E0E0'
                placeholder='Enter a message..'
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d='flex' alignItems='center' justifyContent='center' h='100%'>
          <Text fontSize='3xl' pb={3} fontFamily='Work sans'>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
