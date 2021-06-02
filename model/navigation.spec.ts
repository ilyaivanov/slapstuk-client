import { Store } from "./store";
import { folder, home } from "../api/itemsBuilder";
import { ItemModel } from "./ItemModel";

//here is the test data structure for visual representation of the hierarchy:
//1 first
//2 second
//  2.1 second.child1
//  2.2 second.child2
//    2.2.1 second.child2.child1
//3 third
//4 fourth
describe("Having a loaded app", () => {
  let store: Store;
  let firstFolderSelectionChange: jest.Mock;
  let secondFolderSelectionChange: jest.Mock;
  let second: ItemModel;
  beforeEach(() => {
    store = new Store();

    const first = folder("first");
    second = folder("second", [
      folder("second.child1"),
      folder("second.child2", [folder("second.child2.child1")]),
    ]);
    firstFolderSelectionChange = jest.fn();
    secondFolderSelectionChange = jest.fn();
    first.onSelectionChange(firstFolderSelectionChange);
    second.onSelectionChange(secondFolderSelectionChange);
    store.itemsLoaded(home([first, second, folder("third"), folder("fourth")]));
  });
  it("by default nothing is selected", () =>
    expect(store.mainTabSelectedItem).toBeUndefined());

  it("main tab is focused", () => expect(store.tabFocused).toEqual("main"));

  describe("moving selection down when nothing is selected", () => {
    beforeEach(() => store.moveSelectionDown());
    it("selects first item", () =>
      expect(store.mainTabSelectedItem!.id).toEqual("first"));

    it("calls first folder selection event with true", () => {
      expect(firstFolderSelectionChange).toHaveBeenCalledWith(true);
    });

    describe("moving selection down again", () => {
      beforeEach(() => store.moveSelectionDown());
      it("selects second item", () =>
        expect(store.mainTabSelectedItem!.id).toEqual("second"));

      it("calls second folder selection event with true", () =>
        expect(secondFolderSelectionChange).toHaveBeenCalledWith(true));

      it("calls first folder selection event with false", () =>
        expect(firstFolderSelectionChange).toHaveBeenCalledWith(false));

      describe("moving selection up", () => {
        beforeEach(() => store.moveSelectionUp());
        it("selects first item", () =>
          expect(store.mainTabSelectedItem!.id).toEqual("first"));

        describe("moving selection up again", () => {
          beforeEach(() => store.moveSelectionUp());
          it("should not select home (first is still selected)", () =>
            expect(store.mainTabSelectedItem!.id).toEqual("first"));
        });
      });
    });
  });

  describe("when second is selected and it is open", () => {
    beforeEach(() => store.selectItem(second));
    describe("moving down", () => {
      beforeEach(() => store.moveSelectionDown());
      it("selected second.child1 (first child of 'second')", () =>
        expect(store.mainTabSelectedItem?.id).toEqual("second.child1"));

      describe("moving up", () => {
        beforeEach(() => store.moveSelectionUp());
        it("selects second", () =>
          expect(store.mainTabSelectedItem?.id).toEqual("second"));
      });

      describe("moving down", () => {
        beforeEach(() => store.moveSelectionDown());
        it("selects second.child2", () =>
          expect(store.mainTabSelectedItem?.id).toEqual("second.child2"));

        describe("moving down", () => {
          beforeEach(() => store.moveSelectionDown());
          it("selects second.child2.child1", () =>
            expect(store.mainTabSelectedItem?.id).toEqual(
              "second.child2.child1"
            ));
        });
      });
    });
  });

  describe("when second.child2.child1 is selected", () => {
    beforeEach(() =>
      store.selectItem(second.children!.items[1].children!.items[0])
    );
    describe("selecting next", () => {
      beforeEach(() => store.moveSelectionDown());
      it("selects third", () =>
        expect(store.mainTabSelectedItem!.id).toEqual("third"));

      describe("selecting previous", () => {
        beforeEach(() => store.moveSelectionUp());
        it("selects second.child2.child1", () =>
          expect(store.mainTabSelectedItem!.id).toEqual(
            "second.child2.child1"
          ));
      });
    });

    describe("moving selection up", () => {
      beforeEach(() => store.moveSelectionUp());
      it("selects second.child2", () =>
        expect(store.mainTabSelectedItem!.id).toEqual("second.child2"));
    });
  });
});
