import styled, { CreateStyled } from "@emotion/styled";

export interface Theme {
  colors: {
    baseColor: string;

    darkFontColor: string;
    baseFontColor: string;
    lightFontColor: string;
    background: string;
    default: string;
    shadow: string;
    iconLight: string;

    primary: string;
    primaryShade1: string;
    primaryShade2: string;
    primaryShade3: string;

    primaryOpacity: string;
  };
  fonts: {
    fontSizeBase: string;
    fontSizeSmall: string;
    iconSizeBase: string;
    iconSizeSmall: string;
  };
}

export default styled as CreateStyled<Theme>;
