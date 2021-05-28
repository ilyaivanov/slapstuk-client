import { cls, css, dom, style } from "../infra";
import { Store } from "../model/store";

export default class SearchTab {
  el = dom.div({ classNames: [cls.searchTab] });

  constructor(private store: Store) {
    this.updateSearch(store.isSearchVisible);
    store.onVisiblityChange(this.updateSearch);
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

      this.store.toggleVisibility();
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
