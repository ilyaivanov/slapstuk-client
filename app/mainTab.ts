import { cls, dom, style } from "../infra";
import { ItemModel } from "../model/ItemModel";
import { Store } from "../model/store";

export default class MainTab {
  el = dom.div({ className: cls.mainTab });

  constructor(private store: Store) {
    store.onHomeLoaded(this.updateHome);
  }

  updateHome = (item: ItemModel) => {
    this.el.innerHTML = ``;

    this.el.appendChild(
      dom.fragment(
        item.mapChildren((c) =>
          dom.div({
            testId: "row-" + c.id,
            children: [c.title],
          })
        )
      )
    );
  };
}

style.class(cls.mainTab, {
  flex: 1,
});
