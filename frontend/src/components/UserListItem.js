import React from "react";
import { Box, Avatar, Text } from "@chakra-ui/react";
const UserListItem = ({ user, functionHandler }) => {
  return (
    <Box
      onClick={functionHandler}
      cursor='pointer'
      bg='#E8E8E8'
      _hover={{ background: "#38B2AC", color: "white" }}
      w='100%'
      d='flex'
      color='black'
      alignItems='center'
      px={3}
      py={2}
      mb={2}
      borderRadius='lg'
    >
      <Avatar
        mr={2}
        size='sm'
        cursor='pointer'
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize='xs'>
          <b>Email : </b> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;