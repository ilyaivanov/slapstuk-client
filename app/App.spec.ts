import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/dom";
import { cls } from "../infra";
import { renderApp } from "./app";

describe("Having a loaded app", () => {
  beforeEach(() => {
    document.body.innerHTML = ``;
    document.body.appendChild(renderApp());
  });

  it("by default search tab is hidden", () =>
    expect(searchTab()).toHaveClass(cls.searchTab_Hidden));

  describe("pressing ctrl+2", () => {
    beforeEach(() => shortcuts.ctrlAnd2());

    it("shows search tab", () =>
      expect(searchTab()).not.toHaveClass(cls.searchTab_Hidden));

    describe("pressing ctrl+2 again", () => {
      beforeEach(() => shortcuts.ctrlAnd2());

      it("hides search tab", () =>
        expect(searchTab()).toHaveClass(cls.searchTab_Hidden));
    });
  });
});

const searchTab = () => document.getElementsByClassName(cls.searchTab)[0];

const shortcuts = {
  ctrlAnd2: () =>
    fireEvent.keyDown(document, { code: "Digit2", ctrlKey: true }),
  ctrlAnd1: () =>
    fireEvent.keyDown(document, { code: "Digit1", ctrlKey: true }),
};
