import { cls, css, dom, style } from "../infra";

export default class SearchTab {
  isSearchVisible = false;
  el = dom.div({ classNames: [cls.searchTab] });

  constructor() {
    this.updateSearch(this.isSearchVisible);
    document.addEventListener("keydown", this.onKeyDown);
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (e.code == "Digit1" && e.ctrlKey) {
      e.preventDefault();

      //   console.log("store.focusOnMain();");
      // store.focusOnMain();
    }

    if ((e.code == "Digit2" || e.code == "KeyK") && e.ctrlKey) {
      e.preventDefault();
      this.isSearchVisible = !this.isSearchVisible;
      this.updateSearch(this.isSearchVisible);
    }
  };

  updateSearch = (isVisible: boolean) =>
    isVisible
      ? this.el.classList.remove(cls.searchTab_Hidden)
      : this.el.classList.add(cls.searchTab_Hidden);
}

style.class(cls.searchTab, {
  flex: 1,
  transition: css.transition({ marginRight: 200 }),
  backgroundColor: "rgba(200, 0, 0, 0.7)",
});

style.class(cls.searchTab_Hidden, { marginRight: "-100%" });
