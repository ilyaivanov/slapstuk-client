import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/dom";
import { cls, dom } from "../infra";
import { renderApp } from "./app";
import { Store } from "../model/store";
import * as page from "./pageObjects";
import { home, playlist, video } from "../api/itemsBuilder";
import { ItemModel } from "../model/ItemModel";
import { loadItemChildren } from "../api/itemsLoader";

jest.mock("../infra/anim", () => ({
  animate: () => ({
    addEventListener: (name: string, cb: any) => cb(),
  }),
}));

jest.mock("../api/itemsLoader", () => ({
  loadItemChildren: jest.fn(),
}));

describe("Having a loaded app", () => {
  let store: Store;
  let playlistToBeLoaded: ItemModel;
  beforeEach(() => {
    store = new Store();
    dom.setChild(document.body, renderApp(store));
    playlistToBeLoaded = playlist("MyPlaylist", "my image");
    const newItems = home([playlistToBeLoaded]);

    (loadItemChildren as jest.Mock).mockReset();
    store.itemsLoaded(newItems);
  });

  it("Playlist should have an active chevron", () =>
    expect(page.getChevronFor("MyPlaylist")).toHaveClass(cls.rowChevronActive));

  describe("Clicking on a Playlist chevron", () => {
    beforeEach(() => fireEvent.click(page.getChevronFor("MyPlaylist")));

    it("shows loading indicator", () =>
      expect(page.getLoadingIndicator("MyPlaylist")).toBeInTheDocument());

    it("should call loadItemChildren with that playlist", () =>
      expect(loadItemChildren).toHaveBeenCalledWith(playlistToBeLoaded));

    describe("after items are ready from item loader", () => {
      beforeEach(() =>
        playlistToBeLoaded.itemsLoaded([
          video("MyVid1", "v1"),
          video("MyVid2", "v2"),
          video("MyVid3", "v3"),
        ])
      );
      it("they should be shown as children on MyPlaylist", () => {
        expect(page.getRow("MyVid1")).toBeInTheDocument();
        expect(page.getRow("MyVid2")).toBeInTheDocument();
        expect(page.getRow("MyVid3")).toBeInTheDocument();
      });

      it("closing and opening item when it has been loaded shows children immediatelly", () => {
        fireEvent.click(page.getChevronFor("MyPlaylist"));
        expect(page.queryRow("MyVid1")).not.toBeInTheDocument();
        fireEvent.click(page.getChevronFor("MyPlaylist"));
        expect(page.getRow("MyVid1")).toBeInTheDocument();
      });
    });

    it("closing and opening item while it is loading should not yield another request", () => {
      fireEvent.click(page.getChevronFor("MyPlaylist"));
      fireEvent.click(page.getChevronFor("MyPlaylist"));
      expect(loadItemChildren).toHaveBeenCalledTimes(1);
    });
  });
});
