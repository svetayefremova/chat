export enum Animation {
  floatLeft = "floatLeft",
  floatRight = "floatRight",
}

export interface IColumn {
  align?: string;
  justify?: string;
}

export interface IRow {
  align?: string;
  justify?: string;
}

export interface IButton {
  primary?: boolean;
  rounded?: boolean;
  transparent?: boolean;
  height?: string;
}

export interface IText {
  light?: boolean;
  opacity?: number;
  paddingVertical?: string;
  paddingHorizontal?: string;
  margin?: number;
  size?: string;
  italic?: boolean;
  danger?: boolean;
  color?: string;
  textAlign?: string;
}

export interface IScrollContainer {
  width?: string;
}

export interface IMessageContent {
  backgroundColor: string;
  animation: Animation;
}

export interface IMessageItem {
  align: string;
}

export interface IAvatar {
  margin?: string;
}

export interface IIconButton {
  backgroundColor?: string;
}

export interface IButtonLink {
  border?: string;
}

export interface ICenter {
  height?: string;
}
