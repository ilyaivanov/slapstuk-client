import { cls, colorVars, css, dom, style } from "../infra";
import { ItemModel } from "../model/ItemModel";
import { Store } from "../model/store";
import { renderItem } from "./item/item";

export default class MainTab {
  el = dom.div({ className: cls.mainTab });

  constructor(private store: Store) {
    store.onHomeLoaded(this.updateHome);
  }

  updateHome = (item: ItemModel) => {
    this.el.innerHTML = ``;

    this.el.appendChild(
      dom.fragment(item.mapChildren((item) => renderItem(item)))
    );
  };
}

style.class(cls.mainTab, {
  paddingTop: 45,
  flex: 1,
  overflow: "overlay",
  paddingBottom: "calc(100vh - 150px)",
});

css.createScrollStyles(cls.mainTab, {
  scrollbar: { width: 8 },
  thumb: {
    backgroundColor: colorVars.scrollBar,
  },
});
