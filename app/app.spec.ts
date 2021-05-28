import "@testing-library/jest-dom";
import { fireEvent, getByTestId } from "@testing-library/dom";
import { cls } from "../infra";
import { renderApp } from "./app";
import { Store } from "../model/store";
import { buildItems } from "../api/itemsBuilder";

describe("Having a loaded app", () => {
  let store: Store;
  beforeEach(() => {
    store = new Store();
    document.body.innerHTML = ``;
    document.body.appendChild(renderApp(store));
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

  describe("when loading items from a backend (dummy data loader for tests)", () => {
    beforeEach(() => {
      store.itemsLoaded(
        buildItems(`
      HOME
        first
        second
        third
      `)
      );
    });
    it("it should show that rows", () => {
      expect(row("first")).toBeInTheDocument();
      expect(row("second")).toBeInTheDocument();
      expect(row("third")).toBeInTheDocument();
    });
  });
});

const searchTab = () => document.getElementsByClassName(cls.searchTab)[0];
const row = (id: string) => getByTestId(document.body, "row-" + id);

const shortcuts = {
  ctrlAnd2: () =>
    fireEvent.keyDown(document, { code: "Digit2", ctrlKey: true }),
  ctrlAnd1: () =>
    fireEvent.keyDown(document, { code: "Digit1", ctrlKey: true }),
};
