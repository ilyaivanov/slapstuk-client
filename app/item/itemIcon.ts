import {
  ClassName,
  cls,
  colorVars,
  timings,
  css,
  dom,
  icons,
  style,
  Styles,
  svg,
} from "../../infra";
import { spacings } from "../../infra/constants";
import { ItemModel } from "../../model/ItemModel";

const { outerRadius, innerRadius } = spacings;
const iconSize = outerRadius * 2;

const renderIcon = (item: ItemModel): Node => {
  const chevron = icons.chevron({
    className: cls.rowChevron,
    classMap: {
      "row-chevron-active": !item.isEmptyNoNeedToLoad,
    },
    onClick: item.toggleVisibility,
  });

  const rowCircle = svg.svg({
    className: cls.rowIcon,
    viewBox: `0 0 ${iconSize} ${iconSize}`,
    children: item.isEmptyNoNeedToLoad
      ? [createCircleAtCenter(cls.rowCircleEmpty, innerRadius)]
      : [
          createCircleAtCenter(cls.rowCircleOuter, outerRadius),
          createCircleAtCenter(cls.rowCircleInner, innerRadius),
        ],
  });

  const onVisibilityChange = (isOpen: boolean) => {
    dom.assignClassMap(chevron, { [cls.rowChevronOpen]: isOpen });
    dom.assignClassMap(rowCircle, { [cls.rowIconOpen]: isOpen });
  };

  onVisibilityChange(item.isOpen);
  item.onVisibilityChange(onVisibilityChange);
  return dom.fragment([chevron, rowCircle]);
};

const createCircleAtCenter = (className: ClassName, r: number) =>
  svg.circle({ cx: iconSize / 2, cy: iconSize / 2, className, r });

style.class(cls.rowIcon, {
  marginRight: spacings.spaceBetweenCircleAndText,
  //   cursor: "pointer",
  width: iconSize,
  minWidth: iconSize,
  height: iconSize,
  //   backgroundSize: "cover",
  //   backgroundPosition: `50% 50%`,
  //   color: css.useVar(cssVar.ambient),
  backgroundSize: "cover",
  backgroundPosition: `50% 50%`,
});

style.class(cls.rowCircleInner, {
  fill: colorVars.itemInnerCircle,
});

style.class(cls.rowCircleOuter, {
  fill: colorVars.itemOuterCircle,
  opacity: 1,
  transition: css.transition({ opacity: timings.itemCollapse }),
});

style.class(cls.rowCircleEmpty, {
  fill: "transparent",
  strokeWidth: 1.4,
  stroke: colorVars.itemInnerCircle,
});

const opaque: Styles = { opacity: 1 };
const transparent: Styles = { opacity: 0 };
style.parentChild(cls.rowIconOpen, cls.rowCircleOuter, transparent);

style.class(cls.rowChevron, {
  height: spacings.chevronSize,
  width: spacings.chevronSize,
  borderRadius: spacings.chevronSize,
  //   marginTop: spacings.imageSize / 2 - spacings.chevronSize / 2,
  minWidth: spacings.chevronSize,
  color: "#B8BCBF",
  opacity: 0,
  userSelect: "none",
  pointerEvents: "none",
  onHover: { color: "currentColor" },
  transition: css.transition({ transform: timings.itemCollapse }),
});

style.class(cls.rowChevronOpen, {
  transform: "rotateZ(90deg)",
});

style.parentHover(cls.row, cls.rowChevronActive, {
  opacity: 1,
  pointerEvents: "all",
});

export default renderIcon;
