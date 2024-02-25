import type { DeepPartial, Theme } from "@chakra-ui/react";

/** extend additional color here */
const extendedColors: DeepPartial<
  Record<string, Theme["colors"]["blackAlpha"]>
> = {
  grey: {
    "50": "#EFF1F5",
    "100": "#D3D7E4",
    "200": "#B7BDD2",
    "300": "#9AA4C0",
    "400": "#7E8AAF",
    "500": "#62709D",
    "600": "#4E5A7E",
    "700": "#3B435E",
    "800": "#272D3F",
    "900": "#14161F",
  },
  red: {
    "50": "#FEE6E6",
    "100": "#FCBABA",
    "200": "#FB8E8E",
    "300": "#F96262",
    "400": "#F73636",
    "500": "#F50A0A",
    "600": "#C40808",
    "700": "#930606",
    "800": "#620404",
    "900": "#310202",
  },
  orange: {
    "50": "#FDF0E8",
    "100": "#F9D5BE",
    "200": "#F5BA94",
    "300": "#F19F6A",
    "400": "#ED8440",
    "500": "#E96916",
    "600": "#BA5412",
    "700": "#8C3F0D",
    "800": "#5D2A09",
    "900": "#2F1504",
  },
  yellow: {
    "50": "#FBF9EA",
    "100": "#F3EDC3",
    "200": "#ECE29D",
    "300": "#E4D777",
    "400": "#DDCB50",
    "500": "#D5C02A",
    "600": "#AB9921",
    "700": "#807319",
    "800": "#554D11",
    "900": "#2B2608",
  },
  darkBlue: {
    "400": "#223C5F",
    "500": "#10203F",
  },
  midBlue: {
    "400": "#0046B7",
    "500": "#003294",
  },
  lightBlue: {
    "400": "#2D6DDF",
    "500": "#2257BF",
  },
};

/** override chakra colors here */
const overridenChakraColors: DeepPartial<Theme["colors"]> = {};

export const colors = {
  ...overridenChakraColors,
  ...extendedColors,
};
