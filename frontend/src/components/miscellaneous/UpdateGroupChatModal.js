import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  IconButton,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../UserBadgeItem";
import axios from "axios";
import { debounce } from "lodash";
import UserListItem from "../UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, selectedChat, setSelectedChat } = ChatState();

  const renameHandler = async () => {
    if (!groupChatName.trim()) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        { chatName: groupChatName, chatId: selectedChat._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "buttom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  const searchHandler = debounce(async (query) => {
    if (!query.trim()) {
      return;
    }
    setSearch(query);
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      console.log("data", data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to find users",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-center",
      });
    }
  }, 1000);

  const addUserHandler = async (userToAdd) => {
    if (selectedChat.users.find((user) => user._id === userToAdd._id)) {
      toast({
        title: "User already in the group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "buttom",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "buttom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        { chatId: selectedChat._id, userId: userToAdd._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const removeHandler = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      toast({
        title: "only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "buttom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        { chatId: selectedChat._id, userId: userToRemove._id },
        config
      );
      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work sans'
            d='flex'
            justifyContent='center'
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w='100%' d='flex' flexWrap='wrap' pb={3}>
              {selectedChat.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  functionHandler={() => removeHandler(user)}
                />
              ))}
            </Box>
            <FormControl d='flex'>
              <Input
                placeholder='Chat Name'
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant='solid'
                colorScheme='teal'
                ml={1}
                isLoading={renameLoading}
                onClick={renameHandler}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder='Add User to group'
                mb={1}
                onChange={(e) => searchHandler(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size='lg' />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  functionHandler={() => addUserHandler(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' onClick={() => removeHandler(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
