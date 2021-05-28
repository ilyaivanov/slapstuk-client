import { cls, dom, levels, style } from "../infra";
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
      dom.fragment(item.mapChildren((item) => this.renderItem(item)))
    );
  };

  renderItem = (item: ItemModel, level = 0): Node =>
    item.isOpen
      ? dom.fragment([
          this.renderRow(item, level),
          this.renderChildren(item, level),
        ])
      : this.renderRow(item, level);

  renderRow = (item: ItemModel, level: number) =>
    dom.div({
      testId: "row-" + item.id,
      className: levels.rowForLevel(level),
      children: [
        dom.span({
          text: item.title,
          className: cls.rowTitle,
        }),
      ],
    });

  renderChildren = (item: ItemModel, level: number) =>
    dom.div({
      testId: "row-children-" + item.id,
      className: levels.childrenForLevel(level),
      children: item.mapChildren((child) => this.renderItem(child, level + 1)),
    });
}

style.class(cls.mainTab, {
  flex: 1,
});
