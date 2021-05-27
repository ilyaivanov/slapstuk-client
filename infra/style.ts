import { ClassName, ElementId, VariableName } from "./keys";

const s = document.createElement("style");
document.head.appendChild(s);

const selector = (selector: string, styles: StylesWithVariables) => {
  const res = Array.isArray(selector) ? selector.join(", ") : selector;
  s.innerHTML += cssToString(res, styles);
};

const ignoredStyles: Record<string, number> = {
  onHover: 1,
  themes: 1,
  variables: 1,
};

type StylesWithVariables = Styles & {
  variables?: Partial<Record<VariableName, string>>;
};

type CompoundStyles = StylesWithVariables & {
  onHover?: Styles;
  active?: Styles;
};

type CN = ClassName; //just for being short

const handleCompoundStyles = (
  elementSelector: string,
  styles: CompoundStyles
) => {
  selector(elementSelector, styles);
  if (styles.onHover) selector(`${elementSelector}:hover`, styles.onHover);
  if (styles.active) selector(`${elementSelector}:active`, styles.active);
};

export const style = {
  selector,
  tag: (tagName: keyof HTMLElementTagNameMap, styles: StylesWithVariables) =>
    selector(`${tagName}`, styles),

  class: (className: CN, styles: CompoundStyles) =>
    handleCompoundStyles(`.${className}`, styles),
  id: (id: ElementId, styles: CompoundStyles) =>
    handleCompoundStyles(`#${id}`, styles),
  after: (className: CN, styles: Styles) => {
    selector(`.${className}::after`, styles);
  },
  parentHover: (parent: CN, child: CN, styles: StylesWithVariables) =>
    selector(`.${parent}:hover > .${child}`, styles),
  parentChild: (parent: CN, child: CN, styles: StylesWithVariables) =>
    selector(`.${parent} .${child}`, styles),
  parentDirectChild: (parent: CN, child: CN, styles: StylesWithVariables) =>
    selector(`.${parent} > .${child}`, styles),
};

const cssToString = (selector: string, props: StylesWithVariables) => {
  let values = Object.entries(props).map(([key, val]) => {
    const isNotIgnored = !ignoredStyles[key];
    return typeof val !== "undefined" &&
      isNotIgnored &&
      (typeof val == "number" || typeof val === "string")
      ? `\t${camelToSnakeCase(key)}: ${convertVal(key, val)};`
      : "";
  });
  if (props.variables) {
    const variablesFormatted = Object.entries(props.variables).map(
      ([variableKey, variableValue]) => `\t--${variableKey}: ${variableValue};`
    );
    values = values.concat(variablesFormatted);
  }
  return `\n${selector}{\n${values.join("\n")}\n}\n`;
};

//I'm using whitelist approach
//in other words I add px to every number values expect 'opacity', 'flex' and other
//and I'm leaving zeros for any value as string without px postfix
const whitelist: Styles = {
  zIndex: 1,
  opacity: 1,
  flex: 1,
  // fontWeight: 1,
  lineHeight: 1,
};

const convertVal = (key: string, val: number | string) => {
  if ((whitelist as any)[key]) return val + "";

  if (typeof val == "number") return val + "px";
  return val + "";
};

export const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export type Styles = Partial<{
  //display
  opacity: number;

  //sizing
  height: number | "100vh" | "100%";
  width: number | string;
  minWidth: number;
  minHeight: number;
  boxSizing: "border-box";

  //margins and paddings
  margin: number;
  marginRight: number | "-100%";
  marginLeft: number;
  marginTop: number;
  marginBottom: number;
  padding: number | string;
  paddingRight: number;
  paddingLeft: number | string;
  paddingTop: number | string;
  paddingBottom: number;

  //positioning
  position: "absolute" | "relative" | "fixed";
  top: number | "100%" | string;
  right: number;
  bottom: number;
  left: number | string;
  zIndex: number;
  overflow: "hidden" | "auto" | "scroll" | "overlay";
  overflowX: "hidden" | "auto" | "scroll" | "overlay";
  overflowY: "hidden" | "auto" | "scroll" | "overlay";

  //flex
  flex: number;
  display: "flex" | "inline-block";
  flexDirection: "row" | "column";
  justifyContent: "flex-start" | "center" | "flex-end";
  flexWrap: "wrap";
  alignSelf: "stretch";
  alignItems: "flex-start" | "center" | "flex-end";

  //border
  border: string;
  outline: string;
  borderRadius: number | "50%";
  borderTopRightRadius: number;
  borderTopLeftRadius: number;
  borderBottomLeftRadius: number;
  borderBottomRightRadius: number;

  //colors
  backgroundColor: string;

  //transitions
  transition: string;

  //typography
  fontFamily: string;
  color: string | VariableName;
  lineHeight: number;
  fontSize: number;
  fontWeight: "bold";

  //shadows
  boxShadow: string;

  //svg
  stroke: string;
  strokeWidth: number;
  fill: string;

  //background
  backgroundImage: string;
  backgroundSize: "cover";
  backgroundPosition: string;
  background: string;

  //Other
  cursor: "pointer";
  userSelect: "none";
  transform: string;
  transformOrigin: string;
  pointerEvents: "none" | "all";
  visibility: "hidden";
  content: `" "`;
}>;
