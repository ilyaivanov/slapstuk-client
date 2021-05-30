import { convertNumericStylesToProperCssOjbect } from "./style";

it("sample", () => {
  const expected = {
    "margin-left": "3px",
  };
  const reveiced = convertNumericStylesToProperCssOjbect({ marginLeft: 3 });
  expect(reveiced).toEqual(expected);
});
