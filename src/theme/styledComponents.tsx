import { Link as link } from "react-router-dom";

import styled, { Theme } from "./styled";

interface Column {
  align?: string
  justify?: string
}

interface Row {
  align?: string
  justify?: string
}

interface Button {
  primary?: boolean
  rounded?: boolean
  transparent?: boolean
  height?: string
}

interface Text {
  light?: boolean
  opacity?: number
  paddingVertical?: string
  paddingHorizontal?: string
  margin?: number
  size?: string
  italic?: boolean
}

interface ScrollContainer {
  width?: string
}

interface MessageContent {
  backgroundColor: string
}

interface MessageItem {
  align: string
}

interface Avatar {
  margin?: string
}

interface IconButton {
  backgroundColor?: string
}

interface ButtonLink {
  border?: string
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
  align-items: ${(props: Row) => props.align};
  justify-content: ${(props: Row) => props.justify};
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props: Column) => props.align};
  justify-content: ${(props: Column) => props.justify};
`;

export const Button = styled.button`
  height: ${(props: Button) => (props.height ? props.height : "2rem")};
  background-color: ${({ theme }) => theme.colors.primaryShade3};
  border: none;
  color: white;
  cursor: pointer;
  text-align: center;
  transition: background 250ms ease-in-out, transform 150ms ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.primaryShade2};
  }
`;

export const ButtonLink = styled.button`
  border: ${(props: ButtonLink) => (props.border ? props.border : "none")};;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  text-align: center;
  transition: background 250ms ease-in-out, transform 150ms ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 100%;
  font-size: ${({ theme }) => theme.fonts.fontSizeSmall};
  padding: 0.4rem;
  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.primaryOpacity};
  }
`;

export const IconButton = styled.button`
  border: none;
  background-color: ${(props: IconButton) => props.backgroundColor ? props.backgroundColor : "transparent"};
  height: 2rem;
  width: 2rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.baseFontColor};
  transition: background 250ms ease-in-out, transform 150ms ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.primaryOpacity};
  }
`

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
  width: ${(props: ScrollContainer) => (props.width ? props.width : "auto")};
  overflow-y: auto;
`;

export const Text = styled.p`
  margin: ${(props: Text) => (props.margin ? props.margin : 0)};
  padding-top: ${(props: Text) =>
    props.paddingVertical ? props.paddingVertical : 0};
  padding-bottom: ${(props: Text) =>
    props.paddingVertical ? props.paddingVertical : 0};
  padding-left: ${(props: Text) =>
    props.paddingHorizontal ? props.paddingHorizontal : 0};
  padding-right: ${(props: Text) =>
    props.paddingHorizontal ? props.paddingHorizontal : 0};
  color: ${(props: Text & { theme: Theme }) =>
    props.light ? "white" : props.theme.colors.baseColor};
  opacity: ${(props: Text) => (props.opacity ? props.opacity : 1)};
  font-size: ${(props: Text & { theme: Theme }) =>
    props.size ? props.size : props.theme.fonts.fontSizeBase};
  font-style: ${(props: Text) =>
    props.italic ? 'italic' : 'normal'};
`;

export const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const MessageItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: ${(props: MessageItem) => props.align};
  padding-left: 1rem;
  padding-right: 1rem;
`;

export const MessageContent = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 18rem;
  min-width: 4rem;
  background-color: ${(props: MessageContent) => props.backgroundColor};
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
  margin: ${(props: Avatar) => (props.margin ? props.margin : 0)};
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
`
