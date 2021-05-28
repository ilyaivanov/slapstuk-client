import { cls, dom, style } from "../infra";
import Header from "./header";
import MainTab from "./mainTab";
import SearchTab from "./searchTab";
import { Store } from "../model/store";

export const renderApp = (store: Store) => {
  const header = new Header();
  const mainTab = new MainTab(store);
  const searchTab = new SearchTab(store);
  return dom.div({
    className: cls.page,
    children: [
      header.el,
      dom.div({
        className: cls.main,
        children: [mainTab.el, searchTab.el],
      }),
    ],
  });
};

style.class(cls.page, {
  height: "100vh",
  width: "100vw",
  backgroundColor: "rgba(0,0,0,0.07)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

style.class(cls.main, {
  flex: 1,
  display: "flex",
  flexDirection: "row",
  overflow: "hidden",
});
