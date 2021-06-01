import { ItemModel } from "../model/ItemModel";
import { Store } from "../model/store";
import { search, video } from "./itemsBuilder";

export const loadItemChildren = (item: ItemModel) => {
  setTimeout(
    () =>
      item.itemsLoaded([
        video("MyVid1", "v1"),
        video("MyVid2", "v2"),
        video("MyVid3", "v3"),
      ]),
    1000
  );
};

export const searchItems = (store: Store, term: string) => {
  setTimeout(
    () =>
      store.searchIsDone(
        search([
          video("MyVid1  _" + term, "v1"),
          video("MyVid2  _" + term, "v2"),
          video("MyVid3  _" + term, "v3"),
        ])
      ),
    1000
  );
};
