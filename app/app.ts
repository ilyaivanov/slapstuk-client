import { cls, colorVars, dom, icons, style, getThemeClassMap } from "../infra";
import Header from "./header";
import MainTab from "./mainTab";
import SearchTab from "./searchTab";
import { Store, Theme } from "../model/store";

export const renderApp = (store: Store) => {
  const header = new Header();
  const mainTab = new MainTab(store);
  const searchTab = new SearchTab(store);
  const container = dom.div({
    classNames: [cls.page, cls.darkTheme],
    children: [
      header.el,
      dom.div({
        className: cls.main,
        children: [mainTab.el, searchTab.el],
      }),
      renderThemeToggler(store.toggleTheme),
    ],
  });

  const assignThemeClass = (theme: Theme) =>
    dom.assignClassMap(container, getThemeClassMap(theme));

  assignThemeClass(store.theme);
  store.onThemeChange(assignThemeClass);
  return container;
};

style.class(cls.page, {
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  backgroundColor: colorVars.background,
  color: colorVars.textOnBackground,
});

style.class(cls.main, {
  flex: 1,
  display: "flex",
  flexDirection: "row",
  overflow: "hidden",
});

style.tag("body", {
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
});

const renderThemeToggler = (onClick: EmptyAction) => {
  return dom.div({
    onClick,
    className: cls.themeToggle,
    children: [icons.bucket({ className: cls.themeToggleIcon })],
  });
};

const buttonSize = 40;
const iconSize = 14;

style.class(cls.themeToggle, {
  padding: (buttonSize - iconSize) / 2,
  position: "fixed",
  bottom: 15,
  right: 15,
  borderRadius: 40,
  cursor: "pointer",
  onHover: { backgroundColor: colorVars.hover },
});

style.class(cls.themeToggleIcon, {
  width: iconSize,
  height: iconSize,
  display: "block",
  color: colorVars.fadedTextOnBackground,
});
