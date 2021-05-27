import { cls, dom } from "../infra";
import Header from "./Header";
import MainTab from "./MainTab";

export const renderApp = () => {
  const header = new Header();
  const mainTab = new MainTab();
  return dom.div({
    className: cls.page,
    children: [header.el, mainTab.el],
  });
};
