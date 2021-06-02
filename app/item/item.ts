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

const renderRow = (item: ItemModel, level: number) => {
  const row = dom.div({
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
  item.onSelectionChange((isSelected) =>
    dom.assignClassMap(row, {
      [cls.rowSelected]: isSelected,
    })
  );
  item.onRename((isRenaming) => {
    if (isRenaming) {
      const span = row.getElementsByClassName(cls.rowTitle)[0];
      if (span) {
        span.remove();
        const input = dom.input({
          className: cls.rowTitleInput,
          value: item.title,
          onKeyDown: (e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") {
              item.cancelRename();
            }
            if (e.key === "ArrowLeft" || e.key === "ArrowRight")
              e.stopPropagation();
          },
          onBlur: (e) => item.finalizeRename(e.currentTarget.value),
        });
        row.appendChild(input);
        input.focus();
      }
    } else {
      const input = row.getElementsByClassName(cls.rowTitleInput)[0];
      if (input && input.isConnected) {
        input.remove();
        row.appendChild(
          dom.span({
            text: item.title,
            className: cls.rowTitle,
          })
        );
      }
    }
  });
  return row;
};

const renderChildren = (item: ItemModel, level: number) => {
  //TODO: do not render children at all when closed
  //append to row instead of rendering this stuff
  const childContainer = dom.div({
    testId: "row-children-" + item.id,
    classNames: [cls.rowChildren],
  });
  const assignChildren = () => {
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
    assignChildren();
  }
  const expandContainer = (fromHeight = 0) => {
    const height = childContainer.clientHeight;
    anim.animate(childContainer, [{ height: fromHeight }, { height }], {
      duration: timings.itemExpand,
      easing: "ease-out",
    });
  };
  const collapseContainer = () => {
    const height = childContainer.clientHeight;
    anim
      .animate(childContainer, [{ height }, { height: 0 }], {
        duration: timings.itemCollapse,
        easing: "ease-out",
      })
      .addEventListener("finish", () => dom.removeChildren(childContainer));
  };

  const onVisiblityChange = (isOpenning: boolean) => {
    if (isOpenning && item.isLoading) {
      dom.setChild(
        childContainer,
        dom.span({
          classNames: [cls.rowLoading, levels.rowForLevel(level)],
          text: "Loading...",
          testId: "row-loading-" + item.id,
        })
      );
      expandContainer();
    } else if (isOpenning) {
      assignChildren();
      expandContainer();
    } else {
      item.unassignChildrenOpenCloseEvents();
      collapseContainer();
    }
  };

  const onItemLoaded = () => {
    if (item.isOpen) {
      const currentHeight = childContainer.clientHeight;
      assignChildren();
      expandContainer(currentHeight);
    }
  };

  item.onVisibilityChange(onVisiblityChange);
  item.onItemLoaded(onItemLoaded);

  return childContainer;
};

style.class(cls.row, {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",

  ...css.paddingVertical(4),
  onHover: { backgroundColor: colorVars.rowHover },
});

style.class2(cls.row, cls.rowSelected, {
  backgroundColor: colorVars.rowSelected,
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

style.class(cls.rowLoading, {
  fontStyle: "italic",
  marginLeft: 60,
});
