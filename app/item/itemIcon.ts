import { ClassName, cls, colorVars, dom, icons, style, svg } from "../../infra";
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
  const assignChevronClass = (isOpen: boolean) =>
    dom.assignClassMap(chevron, { "row-chevron-open": isOpen });

  assignChevronClass(item.isOpen);
  item.onVisibilityChange(assignChevronClass);
  return dom.fragment([
    chevron,
    svg.svg({
      className: cls.rowIcon,
      viewBox: `0 0 ${iconSize} ${iconSize}`,
      children: [createCircleAtCenter(cls.rowCircleInner, innerRadius)],
    }),
  ]);
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
  fill: colorVars.primary,
  //   transition: css.transition({
  //     opacity: timings.expandCollapseDuration,
  //     fill: timings.themeSwitchDuration,
  //   }),
});

style.class(cls.rowChevron, {
  height: spacings.chevronSize,
  width: spacings.chevronSize,
  borderRadius: spacings.chevronSize,
  //   marginTop: spacings.imageSize / 2 - spacings.chevronSize / 2,
  minWidth: spacings.chevronSize,
  //   transition: css.transition({
  //     transform: 200,
  //     opacity: 100,
  //   }),
  color: "#B8BCBF",
  opacity: 0,
  userSelect: "none",
  pointerEvents: "none",
  onHover: { color: "currentColor" },
});

style.class(cls.rowChevronOpen, {
  transform: "rotateZ(90deg)",
});

style.parentHover(cls.row, cls.rowChevronActive, {
  opacity: 1,
  pointerEvents: "all",
});

export default renderIcon;
