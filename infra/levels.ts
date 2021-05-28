import { ClassName } from "./keys";
import { spacings } from "./constants";
import { style } from "./style";

// this file generates a bunch of classes for nested levels
// I'm using this approach because gallery view requires full width while being nested

export const rowForLevel = (level: number): ClassName =>
  ("level_" + level) as unknown as ClassName;

export const childrenForLevel = (level: number): ClassName =>
  ("children-level_" + level) as unknown as ClassName;

const numberOfLevelsToGenerate = 11;

const borderWidth = 2;

for (let level = 0; level < numberOfLevelsToGenerate; level++) {
  const base = `max((100% - ${spacings.treeMaxWidth}px) / 2, 20px)`;
  const levelPadding = `${level * spacings.spacePerLevel}px`;
  style.class(rowForLevel(level), {
    paddingLeft: `calc(${base} + ${levelPadding})`,
    paddingRight: 20,
  });
  style.class(`children-level_${level}` as any, {
    left: `calc(${base} + ${
      level * spacings.spacePerLevel +
      spacings.chevronSize +
      spacings.outerRadius -
      borderWidth / 2
    }px)`,
  });
}
