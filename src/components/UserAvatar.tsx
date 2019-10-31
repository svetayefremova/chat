/** @jsx jsx */
import { jsx } from "@emotion/core";

import { Avatar, Text } from "../theme";
import { setAvatarInitials } from "../utils";

const UserAvatar = ({ username, ...avatarProps }) => (
  <Avatar {...avatarProps}>
    <Text>{setAvatarInitials(username)}</Text>
  </Avatar>
);

export default UserAvatar;
