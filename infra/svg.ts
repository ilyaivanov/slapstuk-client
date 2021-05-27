import { ClassDefinitions, assignClasses, Events, assignEvents } from "./dom";
import { camelToSnakeCase, Styles } from "./style";
type BaseSvg = ClassDefinitions & Events;
type SvgInlineStyles = Pick<Styles, "backgroundImage">;

export interface SvgProps extends BaseSvg {
  style?: SvgInlineStyles;
  viewBox: string;
  fill?: string;
  children: (SVGElement | undefined)[];
}
export const svg = (props: SvgProps): SVGSVGElement =>
  appendChildren(
    assignEvents(
      assignSvgAttributes(
        assignSvgInlineStyles(svgElem("svg"), props.style),
        props
      ),
      props
    ),
    props.children
  );

export interface CircleProps extends ClassDefinitions {
  cx: number;
  cy: number;
  r: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}
export const circle = (circleProps: CircleProps) =>
  assignSvgAttributes(svgElem("circle"), circleProps);

export interface PolygonProps extends ClassDefinitions {
  points: string;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinejoin?: "round";
}
export const polygon = (props: PolygonProps) =>
  assignSvgAttributes(svgElem("polygon"), props);

export interface PathProps extends ClassDefinitions {
  d: string;
  fill?: string;
  stroke?: string;
  strokeLinecap?: string;
}
export const path = (props: PathProps) =>
  assignSvgAttributes(svgElem("path"), props);

//SVG infra

const svgAttributesIgnored: Record<string, boolean> = {
  children: true,
  className: true,
  classMap: true,
  style: true,
  onClick: true,
};

const attributesInPascal: Record<string, boolean> = {
  viewBox: true,
};
const assignSvgAttributes = <T extends Element>(elem: T, attributes: {}): T => {
  assignClasses(elem, attributes);
  Object.entries(attributes).forEach(([key, value]) => {
    if (value && !svgAttributesIgnored[key]) {
      const keyConverted = attributesInPascal[key]
        ? key
        : camelToSnakeCase(key);
      elem.setAttribute(keyConverted, value + "");
    }
  });
  return elem;
};

const assignSvgInlineStyles = (
  elem: SVGSVGElement,
  styles: SvgInlineStyles | undefined
): SVGSVGElement => {
  if (styles) {
    if (styles.backgroundImage)
      elem.style.backgroundImage = styles.backgroundImage;
  }
  return elem;
};

const svgNamespace = "http://www.w3.org/2000/svg";
const svgElem = <T extends keyof SVGElementTagNameMap>(name: T) =>
  document.createElementNS(svgNamespace, name) as SVGElementTagNameMap[T];

const appendChildren = <T extends SVGElement>(
  elem: T,
  children: (SVGElement | undefined)[] | undefined
): T => {
  if (children) children.forEach((child) => child && elem.appendChild(child));
  return elem;
};
