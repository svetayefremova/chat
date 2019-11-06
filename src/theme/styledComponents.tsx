import { Link as link } from "react-router-dom";

import styled, { Theme } from "./styled";

interface IColumn {
  align?: string;
  justify?: string;
}

interface IRow {
  align?: string;
  justify?: string;
}

interface IButton {
  primary?: boolean;
  rounded?: boolean;
  transparent?: boolean;
  height?: string;
}

interface IText {
  light?: boolean;
  opacity?: number;
  paddingVertical?: string;
  paddingHorizontal?: string;
  margin?: number;
  size?: string;
  italic?: boolean;
  danger?: boolean;
}

interface IScrollContainer {
  width?: string;
}

interface IMessageContent {
  backgroundColor: string;
}

interface IMessageItem {
  align: string;
}

interface IAvatar {
  margin?: string;
}

interface IIconButton {
  backgroundColor?: string;
}

interface IButtonLink {
  border?: string;
}

interface ICenter {
  height?: string;
}

export const Title = styled.h2`
  color: ${({ theme }) => theme.colors.lightFontColor};
`;

export const LogoTitle = styled.p`
  color: ${({ theme }) => theme.colors.lightFontColor};
  font-size: ${({ theme }) => theme.fonts.fontSizeBase};
  font-weight: 600;
`;

export const Link = styled(link)`
  text-decoration: none;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: ${(props: IRow) => props.align};
  justify-content: ${(props: IRow) => props.justify};
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props: IColumn) => props.align};
  justify-content: ${(props: IColumn) => props.justify};
`;

export const Button = styled.button`
  height: ${(props: IButton) => (props.height ? props.height : "2rem")};
  background-color: ${(props: IButton & { theme: Theme }) => {
    if (props.primary) {
      return props.theme.colors.primaryShade3;
    }

    if (props.transparent) {
      return "transparent";
    }

    return props.theme.colors.primary;
  }};
  border: none;
  color: white;
  cursor: pointer;
  text-align: center;
  width: 100%;
  transition: background-color 250ms ease-in-out;
  -webkit-appearance: none;
  -moz-appearance: none;
  &:hover,
  &:focus {
    outline: none;
    background-color: ${({ theme }) => theme.colors.primaryShade2};
  }
`;

export const ButtonLink = styled.button`
  border: ${(props: IButtonLink) => (props.border ? props.border : "none")};
  background-color: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  text-align: center;
  transition: background-color 250ms ease-in-out;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 100%;
  font-size: ${({ theme }) => theme.fonts.fontSizeSmall};
  padding: 0.4rem;
  &:hover,
  &:focus {
    outline: none;
    background-color: ${({ theme }) => theme.colors.primaryOpacity};
  }
`;

export const IconButton = styled.button`
  border: none;
  background-color: ${(props: IIconButton) =>
    props.backgroundColor ? props.backgroundColor : "transparent"};
  height: 2rem;
  width: 2rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.baseFontColor};
  transition: background-color 250ms ease-in-out;
  -webkit-appearance: none;
  -moz-appearance: none;
  &:hover,
  &:focus {
    outline: none;
    background-color: ${({ theme }) => theme.colors.primaryOpacity};
  }
`;

export const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  height: calc(100vh - 40px);
  max-width: 960px;
  width: 90%;
  margin: 20px auto;
  box-shadow: 0px 0px 10px ${({ theme }) => theme.colors.shadow};
`;

export const ScrollContainer = styled.div`
  max-height: calc(100vh - 72px);
  width: ${(props: IScrollContainer) => (props.width ? props.width : "auto")};
  overflow-y: auto;
`;

export const Text = styled.p`
  margin: ${(props: IText) => (props.margin ? props.margin : 0)};
  padding-top: ${(props: IText) =>
    props.paddingVertical ? props.paddingVertical : 0};
  padding-bottom: ${(props: IText) =>
    props.paddingVertical ? props.paddingVertical : 0};
  padding-left: ${(props: IText) =>
    props.paddingHorizontal ? props.paddingHorizontal : 0};
  padding-right: ${(props: IText) =>
    props.paddingHorizontal ? props.paddingHorizontal : 0};
  color: ${(props: IText & { theme: Theme }) => {
    if (props.danger) {
      return props.theme.colors.error;
    }

    if (props.light) {
      return props.theme.colors.white;
    }

    return props.theme.colors.baseColor;
  }};
  opacity: ${(props: IText) => (props.opacity ? props.opacity : 1)};
  font-size: ${(props: IText & { theme: Theme }) =>
    props.size ? props.size : props.theme.fonts.fontSizeBase};
  font-style: ${(props: IText) => (props.italic ? "italic" : "normal")};
`;

export const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: ${(props: ICenter) => (props.height ? props.height : "100%")};
`;

export const MessageItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: ${(props: IMessageItem) => props.align};
  padding-left: 1rem;
  padding-right: 1rem;
`;

export const MessageContent = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 18rem;
  min-width: 4rem;
  background-color: ${(props: IMessageContent) => props.backgroundColor};
  border-radius: 1.2rem;
  padding: 1rem;
  margin: 0 1rem;
  box-shadow: 0px 0px 10px ${({ theme }) => theme.colors.shadow};
`;

export const Avatar = styled.div`
  width: 2.4rem;
  min-width: 2.4rem;
  height: 2.4rem;
  border-radius: 1.2rem;
  background-color: white;
  box-shadow: 0px 0px 10px ${({ theme }) => theme.colors.shadow};
  margin: ${(props: IAvatar) => (props.margin ? props.margin : 0)};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Textarea = styled.textarea`
  min-height: 2rem;
  padding: 0.8rem;
  width: calc(18rem - 1.6rem);
  border: none;
  resize: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  &:focus {
    outline: none;
  }
`;

export const MessageInput = styled.textarea`
  padding: 0.4rem 2rem 0.4rem 0.8rem;
  width: calc(100% - 2.8rem);
  border: 1px solid ${({ theme }) => theme.colors.baseColorOpacity};
  border-radius: 0.4rem;
  resize: none;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  -webkit-appearance: none;
  -moz-appearance: none;
  ::placeholder {
    font-style: italic;
  }
  &:focus {
    outline: none;
  }
`;

export const ListItem = styled.li`
  padding: 0.4rem 0.8rem;
  width: calc(100% - 1.6rem);
  -webkit-appearance: none;
  -moz-appearance: none;
  transition: background-color 250ms ease-in-out;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.baseColorOpacity};
  }
  > svg {
    opacity: 0;
    transition: opacity 250ms ease-in-out;
  }
  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.primaryOpacity};
    > svg {
      opacity: 1;
    }
  }
`;
