import { cls, dom } from "../../infra";
import { renderApp } from "../app";
import { Store } from "../../model/store";
import * as page from "./pageObjects";
import { folder, home } from "../../api/itemsBuilder";
import { ItemModel } from "../../model/ItemModel";

describe("App", () => {
  let store: Store;
  let first: ItemModel;
  let second: ItemModel;
  beforeEach(() => {
    store = new Store();
    dom.setChild(document.body, renderApp(store));

    first = folder("first");
    second = folder("second");
    store.itemsLoaded(home([first, second]));
    store.selectItem(first);
  });

  it("first is selected", () =>
    expect(page.getRow("first")).toHaveClass(cls.rowSelected));

  it("first has title first (checking initial state)", () =>
    expect(page.rowTitle("first")).toEqual("first"));

  describe("pressing F2", () => {
    beforeEach(() => page.keyboardShortcuts.f2());
    it("shows item title in the input field with focus", () =>
      expect(page.queryInputForTitle("first")).toBeDefined());

    describe("entering a new title 'new title'", () => {
      beforeEach(() => page.inputTitleIntoRowInput("first", "new title"));
      describe("pressing Enter", () => {
        beforeEach(() => page.pressEnterInRowInput("first"));
        it("removes input", () =>
          expect(page.queryInputForTitle("first")).toBeUndefined());

        it("leaves new name as title", () =>
          expect(page.rowTitle("first")).toEqual("new title"));
      });

      describe("pressing Escape", () => {
        beforeEach(() => page.pressEscapeInRowInput("first"));

        it("removes input", () =>
          expect(page.queryInputForTitle("first")).toBeUndefined());

        it("reverts back to an old name", () =>
          expect(page.rowTitle("first")).toEqual("first"));
      });
    });
  });
});
