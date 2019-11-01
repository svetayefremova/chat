export const setAvatarInitials = (name: string) => {
  const username = name.toUpperCase().split(" ");

  return `${username[0].charAt(0)}${username[0].charAt(1)}`;
};
