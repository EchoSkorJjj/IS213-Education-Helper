import { extendTheme } from "@chakra-ui/react";
import { theme as ogpTheme } from "@opengovsg/design-system-react";

import { colors } from "./colors";
import { config } from "./config";
import { fonts } from "./fonts";

const customTheme = extendTheme(ogpTheme, {
  fonts,
  colors,
  config,
});

export default customTheme;
