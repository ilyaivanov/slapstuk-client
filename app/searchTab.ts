import { searchItems } from "../api/itemsLoader";
import { cls, colorVars, css, dom, levels, style } from "../infra";
import { Store } from "../model/store";
import { renderItem } from "./item/item";

export default class SearchTab {
  input = dom.input({
    testId: "search-input",
    classNames: [cls.searchInput],
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        searchItems(this.store, e.currentTarget.value);
        dom.setChild(
          this.searchResults,
          dom.div({
            className: levels.rowForLevel(0),
            children: ["Loading..."],
            testId: "search-loading",
          })
        );
      }
    },
  });

  searchResults = dom.div({});

  el = dom.div({
    classNames: [cls.searchTab],
    children: [
      dom.div({
        classNames: [levels.rowForLevel(0), cls.searchInputGroup],
        children: [
          this.input,
          dom.button({ className: cls.searchInputButton, text: "Search" }),
        ],
      }),
      this.searchResults,
    ],
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
      this.input.blur();
      //   console.log("store.focusOnMain();");
      // store.focusOnMain();
    }

    if ((e.code == "Digit2" || e.code == "KeyK") && e.ctrlKey) {
      e.preventDefault();

      this.store.toggleVisibility();
      //I'm using setTimeout here because focus method scrolls to element,
      //which breaks my transition
      if (this.store.isSearchVisible) setTimeout(() => this.input.focus(), 200);
      else this.input.blur();
    }

    if (e.code === "ArrowDown") {
      e.preventDefault();
      this.store.moveSelectionDown();
    } else if (e.code === "ArrowUp") {
      e.preventDefault();
      this.store.moveSelectionUp();
    } else if (e.code === "ArrowLeft") {
      e.preventDefault();
      this.store.moveSelectionLeft();
    } else if (e.code === "ArrowRight") {
      e.preventDefault();
      this.store.moveSelectionRight();
    }

    if (e.code === "F2") {
      if (this.store.mainTabSelectedItem)
        this.store.mainTabSelectedItem.startRename();
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
  paddingTop: 20,
  borderLeft: `1px solid ${colorVars.tabBorder}`,
});

style.class(cls.searchInputGroup, {
  width: "100%",
  boxSizing: "border-box",
  display: "flex",
});

style.class(cls.searchInput, {
  flex: 1,
});
style.class(cls.searchInputButton, {
  backgroundColor: "red",
});

style.class(cls.searchTab_Hidden, { marginRight: "-100%" });
