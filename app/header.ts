import { cls, dom, style, colorVars } from "../infra";

export default class Header {
  el = dom.div({ className: cls.header });
}

style.class(cls.header, {
  height: 48,
  backgroundColor: colorVars.header,
  boxShadow: `0 -2px 8px rgb(0 0 0 / 9%), 0 4px 8px rgb(0 0 0 / 6%), 0 1px 2px rgb(0 0 0 / 30%), 0 2px 6px rgb(0 0 0 / 15%)`,
});
