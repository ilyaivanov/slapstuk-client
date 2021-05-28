import "@testing-library/jest-dom";
import { fireEvent, getByTestId } from "@testing-library/dom";
import { cls, levels } from "../infra";
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
      const items = buildItems(`
      HOME
        first
          subfirst1
          subfirst2
        second
        third
      `);
      store.itemsLoaded(items);
    });
    it("it should show that rows", () => {
      expect(row("first")).toBeInTheDocument();
      expect(row("second")).toBeInTheDocument();
      expect(row("third")).toBeInTheDocument();
    });

    it("first row should have level 0", () => {
      expect(row("first")).toHaveClass(levels.rowForLevel(0));
    });

    it("title of first should be first", () => {
      expect(rowTitle("first")).toEqual("first");
    });

    it("shows subfirst1 and subfirst2 as child of first", () => {
      expect(row("subfirst1")).toBeInTheDocument();
      expect(row("subfirst2")).toBeInTheDocument();
    });

    it("subfirst1 row should have level 1", () => {
      expect(row("subfirst1")).toHaveClass(levels.rowForLevel(1));
    });
  });
});

const getRowTitle = (row: Element) =>
  row.getElementsByClassName(cls.rowTitle)[0].textContent;

const row = (id: string) => getByTestId(document.body, "row-" + id);
const rowTitle = (id: string) => getRowTitle(row(id));

const searchTab = () => document.getElementsByClassName(cls.searchTab)[0];

const shortcuts = {
  ctrlAnd2: () =>
    fireEvent.keyDown(document, { code: "Digit2", ctrlKey: true }),
  ctrlAnd1: () =>
    fireEvent.keyDown(document, { code: "Digit1", ctrlKey: true }),
};
