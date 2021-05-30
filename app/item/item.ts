import {
  cls,
  style,
  css,
  dom,
  levels,
  colorVars,
  timings,
  anim,
} from "../../infra";
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
  const childContainer = dom.div({
    testId: "row-children-" + item.id,
    classNames: [cls.rowChildren],
  });
  const appendChildren = () => {
    dom.setChildren(
      childContainer,
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
  };
  if (item.isOpen) {
    appendChildren();
  }
  const onVisiblityChange = (isOpenning: boolean) => {
    if (isOpenning) {
      appendChildren();
      const height = childContainer.clientHeight;
      anim.animate(childContainer, [{ height: 0 }, { height }], {
        duration: timings.itemExpand,
        easing: "ease-out",
      });
    } else {
      item.unassignChildrenOpenCloseEvents();
      const height = childContainer.clientHeight;
      anim
        .animate(childContainer, [{ height }, { height: 0 }], {
          duration: timings.itemCollapse,
          easing: "ease-out",
        })
        .addEventListener("finish", () => dom.removeChildren(childContainer));
    }
  };

  item.onVisibilityChange(onVisiblityChange);

  return childContainer;
};

style.class(cls.row, {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",

  ...css.paddingVertical(4),
  onHover: { backgroundColor: colorVars.rowHover },
});

style.class(cls.rowChildren, {
  overflow: "hidden",
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
