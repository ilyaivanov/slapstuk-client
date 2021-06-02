import { cls, dom, levels } from "../infra";
import { renderApp } from "./app";
import { Store } from "../model/store";
import { home, folder, video, playlist } from "../api/itemsBuilder";
import * as page from "./pageObjects";

describe("Having a loaded app", () => {
  let store: Store;
  beforeEach(() => {
    store = new Store();
    dom.setChild(document.body, renderApp(store));
  });

  it("by default search tab is hidden", () =>
    expect(page.searchTab()).toHaveClass(cls.searchTab_Hidden));

  describe("pressing ctrl+2", () => {
    beforeEach(() => page.keyboardShortcuts.ctrlAnd2());

    it("shows search tab", () =>
      expect(page.searchTab()).not.toHaveClass(cls.searchTab_Hidden));

    describe("pressing ctrl+2 again", () => {
      beforeEach(() => page.keyboardShortcuts.ctrlAnd2());

      it("hides search tab", () =>
        expect(page.searchTab()).toHaveClass(cls.searchTab_Hidden));
    });
  });

  describe("when loading items from a backend (dummy data loader for tests)", () => {
    beforeEach(() => {
      const newItems = home([
        folder("first", [
          folder("subfirst1", [folder("subfirst1.child")]),
          folder("subfirst2", [
            video("trip trance", "tripTranceYoutubeID"),
            playlist("myPlaylist", "playlistImage"),
          ]),
        ]),
        folder("second"),
        folder("third"),
      ]);

      store.itemsLoaded(newItems);
    });
    it("it should show that rows", () => {
      expect(page.getRow("first")).toBeInTheDocument();
      expect(page.getRow("second")).toBeInTheDocument();
      expect(page.getRow("third")).toBeInTheDocument();
    });

    it("first row should have level 0", () => {
      expect(page.getRow("first")).toHaveClass(levels.rowForLevel(0));
    });

    it("title of first should be first", () => {
      expect(page.rowTitle("first")).toEqual("first");
    });

    it("shows subfirst1 and subfirst2 as child of first", () => {
      expect(page.getRow("subfirst1")).toBeInTheDocument();
      expect(page.getRow("subfirst2")).toBeInTheDocument();
    });

    it("subfirst1 row should have level 1", () => {
      expect(page.getRow("subfirst1")).toHaveClass(levels.rowForLevel(1));
    });

    it("first chevron is not rotated", () =>
      expect(page.getChevronFor("first")).toHaveClass(cls.rowChevronOpen));

    it("first item chevron is active (it has children)", () =>
      expect(page.getChevronFor("first")).toHaveClass(cls.rowChevronActive));

    it("second item chevron is inactive (it has no children)", () =>
      expect(page.getChevronFor("second")).not.toHaveClass(
        cls.rowChevronActive
      ));

    describe("toggling first", () => {
      beforeEach(() => page.toggleItemVisibility("first"));

      it("hides it's children", () => {
        expect(page.queryRow("subfirst1")).not.toBeInTheDocument();
        expect(page.queryRow("subfirst2")).not.toBeInTheDocument();
      });

      it("doesn't add image closed indicator (because first does not have an image)", () => {
        expect(page.getRowIcon("first")).not.toHaveClass(
          cls.rowIconImageClosed
        );
      });

      it("rotates chevron", () =>
        expect(page.getChevronFor("first")).not.toHaveClass(
          cls.rowChevronOpen
        ));

      describe("toggling first again", () => {
        beforeEach(() => page.toggleItemVisibility("first"));

        it("hides it's children", () => {
          expect(page.getRow("subfirst1")).toBeInTheDocument();
          expect(page.getRow("subfirst2")).toBeInTheDocument();
        });

        it("moves chevron back", () =>
          expect(page.getChevronFor("first")).toHaveClass(cls.rowChevronOpen));
      });
    });

    it("trip trance item icon should have a background image", () =>
      expect(page.getRowIcon("trip trance")).toHaveStyle(
        "background-image: url(https://i.ytimg.com/vi/tripTranceYoutubeID/mqdefault.jpg)"
      ));

    it("trip trance item icon should not have any children", () =>
      expect(page.getRowIcon("trip trance")).toBeEmptyDOMElement());

    it("playlist item icon should have closed outlet", () =>
      expect(page.getRowIcon("myPlaylist")).toHaveClass(
        cls.rowIconImageClosed
      ));

    it("playlist chevron should be active, even thought item is empty (it is loaded from backend)", () =>
      expect(page.getChevronFor("myPlaylist")).toHaveClass(
        cls.rowChevronActive
      ));

    it(`Bug: hide subfolder, hide parent and open parent - subfolder won't open`, () => {
      expect(page.queryRow("subfirst1.child")).toBeInTheDocument();
      page.toggleItemVisibility("subfirst1");
      page.toggleItemVisibility("first");
      page.toggleItemVisibility("first");
      page.toggleItemVisibility("subfirst1");
      expect(page.queryRow("subfirst1.child")).toBeInTheDocument();
    });

    //Memory leaks
    it("when closing and opening first node total number of callbacks should not change (no memory leaks) ", () => {
      const initialCallbackCount = store.home!.getTotalNumberOfListeners();
      page.toggleItemVisibility("first");
      page.toggleItemVisibility("first");
      const res = store.home!.getTotalNumberOfListeners();
      expect(res.callbacksCount).toEqual(initialCallbackCount.callbacksCount);
    });
  });

  //Theme management
  it("by default theme is dark", () =>
    expect(page.page()).toHaveClass(cls.darkTheme));

  describe("toggling theme", () => {
    beforeEach(page.toggleTheme);
    it("switches it to light", () =>
      expect(page.page()).toHaveClass(cls.lightTheme));

    describe("toggling theme again", () => {
      beforeEach(page.toggleTheme);
      it("switches it to dark", () =>
        expect(page.page()).toHaveClass(cls.darkTheme));
    });
  });
});
