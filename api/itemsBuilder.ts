import { ItemCollection, ItemModel } from "../model/ItemModel";

export const home = (children: ItemModel[]): ItemModel =>
  new ItemModel({
    id: "HOME",
    isOpen: true,
    title: "Home",
    type: "folder",
    children: new ItemCollection(children),
  });

export const folder = (title: string, children?: ItemModel[]): ItemModel =>
  new ItemModel({
    id: title,
    isOpen: true,
    title: title,
    type: "folder",
    children: children && new ItemCollection(children),
  });
