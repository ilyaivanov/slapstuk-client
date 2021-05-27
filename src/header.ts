import { cls, dom, style } from "../infra";

export default class Header {
  el = dom.div({ className: cls.header });
}

style.class(cls.header, {
  height: 80,
  backgroundColor: "yellow",
});
