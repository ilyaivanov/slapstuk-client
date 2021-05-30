import { Theme } from "../model/store";
import { ClassName, ClassMap, cls } from "./keys";
import { style } from "./style";

const swatches = {
  grey: {
    "050": "#F0F4F8",
    "100": "#D9E2EC",
    "200": "#BCCCDC",
    "300": "#9FB3C8",
    "400": "#829AB1",
    "500": "#627D98",
    "600": "#486581",
    "700": "#334E68",
    "800": "#243B53",
    "900": "#102A43",
  },
  coolGrey: {
    "050": "#F5F7FA",
    "100": "#E4E7EB",
    "200": "#CBD2D9",
    "300": "#9AA5B1",
    "400": "#7B8794",
    "500": "#616E7C",
    "600": "#52606D",
    "700": "#3E4C59",
    "800": "#323F4B",
    "900": "#1F2933",
  },

  materialElevetion: {
    "00dp": "rgba(255,255,255,0.00)",
    "01dp": "rgba(255,255,255,0.05)",
    "02dp": "rgba(255,255,255,0.07)",
    "03dp": "rgba(255,255,255,0.08)",
    "04dp": "rgba(255,255,255,0.09)",
    "06dp": "rgba(255,255,255,0.11)",
    "08dp": "rgba(255,255,255,0.12)",
    "12dp": "rgba(255,255,255,0.14)",
    "16dp": "rgba(255,255,255,0.15)",
    "24dp": "rgba(255,255,255,0.16)",
  },
};
type ThemeColors = typeof darkTheme;

const darkTheme = {
  //general
  textOnBackground: "white",
  fadedTextOnBackground: "gray",

  //specific
  background: "#121212",
  header: swatches.materialElevetion["02dp"],
  childrenBorder: "#4C5155",
  rowHover: swatches.materialElevetion["01dp"],

  //to figure out
  hover: swatches.materialElevetion["08dp"],
  primary: swatches.grey["100"],
};

const lightTheme: ThemeColors = {
  //general
  textOnBackground: swatches.grey["900"],
  fadedTextOnBackground: "gray",

  //specific
  background: "#EFF2F5",
  header: "rgb(50,54,57)",
  childrenBorder: "#DCE0E2",
  rowHover: "rgba(0,0,0,0.03)",

  //to figure out
  hover: "rgba(0,0,0,0.08)",
  primary: "rgb(76, 81, 85)",
};

const assignColorVariables = (className: ClassName, theme: ThemeColors) =>
  style.class(className, { variables: theme });

export const getThemeClassMap = (theme: Theme): ClassMap => ({
  "theme-dark": theme === "dark",
  "theme-light": theme === "light",
});

export const initThemes = () => {
  assignColorVariables(cls.darkTheme, darkTheme);
  assignColorVariables(cls.lightTheme, lightTheme);
};

export const colorVars: ThemeColors = Object.keys(darkTheme).reduce(
  (res, variable) => ({
    ...res,
    [variable]: `var(--${variable})`,
  }),
  {}
) as typeof darkTheme;
