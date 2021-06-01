import { ItemModel } from "../model/ItemModel";
import { video } from "./itemsBuilder";

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
