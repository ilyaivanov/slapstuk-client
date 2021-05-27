import { cls, dom, style } from "../infra";

export default class MainTab {
  el = dom.div({ className: cls.mainTab });
}

style.class(cls.mainTab, {
  flex: 1,
  backgroundColor: "green",
});
