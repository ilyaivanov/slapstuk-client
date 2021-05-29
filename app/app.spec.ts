import "@testing-library/jest-dom";
import { fireEvent, getByTestId } from "@testing-library/dom";
import { ClassName, cls, levels } from "../infra";
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

  //Theme management
  it("by default theme is dark", () =>
    expect(page()).toHaveClass(cls.darkTheme));

  describe("toggling theme", () => {
    beforeEach(() => fireEvent.click(themeToggler()));
    it("switches it to light", () =>
      expect(page()).toHaveClass(cls.lightTheme));

    describe("toggling theme again", () => {
      beforeEach(() => fireEvent.click(themeToggler()));
      it("switches it to dark", () =>
        expect(page()).toHaveClass(cls.darkTheme));
    });
  });
});

const getRowTitle = (row: Element) =>
  getElementWithClass(cls.rowTitle, row).textContent;

const row = (id: string) => getByTestId(document.body, "row-" + id);
const rowTitle = (id: string) => getRowTitle(row(id));

const searchTab = () => getElementWithClass(cls.searchTab);
const page = () => getElementWithClass(cls.page);
const themeToggler = () => getElementWithClass(cls.themeToggle);

const shortcuts = {
  ctrlAnd2: () =>
    fireEvent.keyDown(document, { code: "Digit2", ctrlKey: true }),
  ctrlAnd1: () =>
    fireEvent.keyDown(document, { code: "Digit1", ctrlKey: true }),
};

//TESTS INFRA
//this is interesting, since method type getElementsByClassName is defined separately in Document and Element,
//I can't just type context with Element or Document, because Document is not an Element
type ContextToFindClasses = {
  getElementsByClassName: typeof document.getElementsByClassName;
};
const getElementWithClass = (
  className: ClassName,
  context: ContextToFindClasses = document
) => {
  const elements = context.getElementsByClassName(className);

  if (elements.length === 0)
    throw new Error(`Can't find any element with class ${className}`);
  if (elements.length > 1)
    throw new Error(
      `Found multiple elements with ${className}. I don't want to silently return first one, use a separate method for that`
    );

  return elements[0];
};
