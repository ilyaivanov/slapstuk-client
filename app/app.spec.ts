import "@testing-library/jest-dom";
import { fireEvent, getByTestId, queryByTestId } from "@testing-library/dom";
import { ClassName, cls, dom, levels } from "../infra";
import { renderApp } from "./app";
import { Store } from "../model/store";
import { home, folder, video } from "../api/itemsBuilder";

jest.mock("../infra/anim", () => ({
  animate: () => ({
    addEventListener: (name: string, cb: any) => cb(),
  }),
}));

describe("Having a loaded app", () => {
  let store: Store;
  beforeEach(() => {
    store = new Store();
    dom.setChild(document.body, renderApp(store));
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
      const newItems = home([
        folder("first", [
          folder("subfirst1", [folder("subfirst1.child")]),
          folder("subfirst2", [video("trip trance", "tripTranceYoutubeID")]),
        ]),
        folder("second"),
        folder("third"),
      ]);

      store.itemsLoaded(newItems);
    });
    it("it should show that rows", () => {
      expect(getRow("first")).toBeInTheDocument();
      expect(getRow("second")).toBeInTheDocument();
      expect(getRow("third")).toBeInTheDocument();
    });

    it("first row should have level 0", () => {
      expect(getRow("first")).toHaveClass(levels.rowForLevel(0));
    });

    it("title of first should be first", () => {
      expect(rowTitle("first")).toEqual("first");
    });

    it("shows subfirst1 and subfirst2 as child of first", () => {
      expect(getRow("subfirst1")).toBeInTheDocument();
      expect(getRow("subfirst2")).toBeInTheDocument();
    });

    it("subfirst1 row should have level 1", () => {
      expect(getRow("subfirst1")).toHaveClass(levels.rowForLevel(1));
    });

    it("first chevron is not rotated", () =>
      expect(getChevronFor("first")).toHaveClass(cls.rowChevronOpen));

    it("first item chevron is active (it has children)", () =>
      expect(getChevronFor("first")).toHaveClass(cls.rowChevronActive));

    it("second item chevron is inactive (it has no children)", () =>
      expect(getChevronFor("second")).not.toHaveClass(cls.rowChevronActive));

    describe("toggling first", () => {
      beforeEach(() => fireEvent.click(getChevronFor("first")));

      it("hides it's children", () => {
        expect(queryRow("subfirst1")).not.toBeInTheDocument();
        expect(queryRow("subfirst2")).not.toBeInTheDocument();
      });

      it("rotates chevron", () =>
        expect(getChevronFor("first")).not.toHaveClass(cls.rowChevronOpen));

      describe("toggling first again", () => {
        beforeEach(() => fireEvent.click(getChevronFor("first")));

        it("hides it's children", () => {
          expect(getRow("subfirst1")).toBeInTheDocument();
          expect(getRow("subfirst2")).toBeInTheDocument();
        });

        it("moves chevron back", () =>
          expect(getChevronFor("first")).toHaveClass(cls.rowChevronOpen));
      });
    });

    it("trip trance item icon should have a background image", () =>
      expect(getRowIcon("trip trance")).toHaveStyle(
        "background-image: url(https://i.ytimg.com/vi/tripTranceYoutubeID/mqdefault.jpg)"
      ));

    it("trip trance item icon should not have any children", () =>
      expect(getRowIcon("trip trance")).toBeEmptyDOMElement());

    it(`Bug: hide subfolder, hide parent and open parent - subfolder won't open`, () => {
      expect(queryRow("subfirst1.child")).toBeInTheDocument();
      fireEvent.click(getChevronFor("subfirst1"));
      fireEvent.click(getChevronFor("first"));
      fireEvent.click(getChevronFor("first"));
      fireEvent.click(getChevronFor("subfirst1"));
      expect(queryRow("subfirst1.child")).toBeInTheDocument();
    });

    //Memory leaks
    it("when closing and opening first node total number of callbacks should not change (no memory leaks) ", () => {
      const initialCallbackCount = store.home!.getTotalNumberOfListeners();
      fireEvent.click(getChevronFor("first"));
      fireEvent.click(getChevronFor("first"));
      const res = store.home!.getTotalNumberOfListeners();
      expect(res.callbacksCount).toEqual(initialCallbackCount.callbacksCount);
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

const getRow = (id: string) => getByTestId(document.body, "row-" + id);
const queryRow = (id: string) => queryByTestId(document.body, "row-" + id);
const rowTitle = (id: string) => getRowTitle(getRow(id));

const getRowIcon = (id: string): HTMLElement =>
  getElementWithClass(cls.rowIcon, getRow(id)) as HTMLElement;
const getChevronFor = (id: string) =>
  getElementWithClass(cls.rowChevron, getRow(id));
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
