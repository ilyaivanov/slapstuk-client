import { convertNumericStylesToProperCssOjbect, Styles } from "./style";

export const animate = (
  elem: Element,
  frames: Styles[],
  options: KeyframeAnimationOptions
) => elem.animate(frames.map(convertNumericStylesToProperCssOjbect), options);
