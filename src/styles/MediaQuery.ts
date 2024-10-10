import { css, type CSSObject, type Interpolation } from "styled-components";

export type Breakpoints =
  | "xsmall"
  | "small"
  | "extra-medium"
  | "medium"
  | "large";

export const breakpoints: Record<Breakpoints, string> = {
  xsmall: "@media (max-width: 380px)",
  small: "@media (max-width: 639px)",
  "extra-medium": "@media (max-width: 900px)",
  medium: "@media (max-width: 1047px)",
  large: "@media (min-width: 1048px)",
};

const media = Object.entries(breakpoints).reduce((acc, [key, value]) => {
  return {
    ...acc,
    [key]: (
      first: CSSObject | TemplateStringsArray,
      ...interpolations: Interpolation<Object>[]
    ) => css`
      ${value} {
        ${css(first, ...interpolations)}
      }
    `,
  };
}, {}) as Record<Breakpoints, any>;

export default media;
