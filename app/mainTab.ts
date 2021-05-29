import { cls, css, dom, levels, style } from "../infra";
import { ItemModel } from "../model/ItemModel";
import { Store } from "../model/store";
import renderIcon from "./itemIcon";

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
      classNames: [cls.row, levels.rowForLevel(level)],
      children: [
        renderIcon(),
        dom.span({
          text: item.title,
          className: cls.rowTitle,
        }),
      ],
    });

  renderChildren = (item: ItemModel, level: number) =>
    dom.div({
      testId: "row-children-" + item.id,
      classNames: [cls.rowChildren],
      children: item
        .mapChildren((child) => this.renderItem(child, level + 1))
        .concat(
          dom.div({
            classNames: [
              cls.rowChildrenBorder,
              levels.childrenBorderForLevel(level),
            ],
          })
        ),
    });
}

style.class(cls.mainTab, {
  flex: 1,
});

style.class(cls.row, {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  ...css.paddingVertical(4),
  onHover: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
});

style.class(cls.rowChildren, {
  position: "relative",
});

style.class(cls.rowChildrenBorder, {
  position: "absolute",
  width: 2,
  top: 0,
  bottom: 0,
  backgroundColor: "#DCE0E2",
});

style.class(cls.rowTitle, {
  paddingBottom: 3,
});
