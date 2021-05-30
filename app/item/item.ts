import { cls, style, css, dom, levels, colorVars } from "../../infra";
import { ItemModel } from "../../model/ItemModel";
import renderIcon from "./itemIcon";

export const renderItem = (item: ItemModel, level = 0): Node =>
  dom.fragment([renderRow(item, level), renderChildren(item, level)]);

const renderRow = (item: ItemModel, level: number) =>
  dom.div({
    testId: "row-" + item.id,
    classNames: [cls.row, levels.rowForLevel(level)],
    children: [
      renderIcon(item),
      dom.span({
        text: item.title,
        className: cls.rowTitle,
      }),
    ],
  });

const renderChildren = (item: ItemModel, level: number) => {
  //TODO: do not render children at all when closed
  //append to row instead of rendering this stuff
  const container = dom.div({
    testId: "row-children-" + item.id,
    classNames: [cls.rowChildren],
  });
  const assignChildren = (isOpen: boolean) => {
    if (isOpen)
      dom.setChildren(
        container,
        item
          .mapChildren((child) => renderItem(child, level + 1))
          .concat(
            dom.div({
              classNames: [
                cls.rowChildrenBorder,
                levels.childrenBorderForLevel(level),
              ],
            })
          )
      );
    else {
      item.unassignChildrenOpenCloseEvents();
      dom.removeChildren(container);
    }
  };

  item.onVisibilityChange(assignChildren);
  assignChildren(item.isOpen);

  return container;
};

style.class(cls.row, {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  ...css.paddingVertical(4),
  onHover: { backgroundColor: colorVars.rowHover },
});

style.class(cls.rowChildren, {
  position: "relative",
});

style.class(cls.rowChildrenBorder, {
  position: "absolute",
  width: 2,
  top: 0,
  bottom: 0,
  backgroundColor: colorVars.childrenBorder,
});

style.class(cls.rowTitle, {
  paddingBottom: 3,
});
