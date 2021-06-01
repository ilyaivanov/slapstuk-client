import { searchItems } from "../api/itemsLoader";
import { cls, css, dom, style } from "../infra";
import { Store } from "../model/store";
import { renderItem } from "./item/item";

export default class SearchTab {
  input = dom.input({
    testId: "search-input",
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        searchItems(this.store, e.currentTarget.value);
        dom.setChild(
          this.searchResults,
          dom.div({ children: ["Loading..."], testId: "search-loading" })
        );
      }
    },
  });

  searchResults = dom.div({});

  el = dom.div({
    classNames: [cls.searchTab],
    children: [this.input, this.searchResults],
  });

  constructor(private store: Store) {
    this.updateSearch(store.isSearchVisible);
    store.onVisiblityChange(this.updateSearch);
    document.addEventListener("keydown", this.onKeyDown);
    store.onSearchLoaded((search) => {
      dom.setChildren(
        this.searchResults,
        search.mapChildren((item) => renderItem(item))
      );
    });
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
      //I'm using setTimeout here because focus method scrolls to element,
      //which breaks my transition
      if (this.store.isSearchVisible) setTimeout(() => this.input.focus(), 200);
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
