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

export const video = (title: string, videoId: string): ItemModel =>
  new ItemModel({
    id: title,
    isOpen: true,
    title: title,
    videoId: videoId,
    type: "YTvideo",
  });

export const playlist = (
  title: string,
  image: string,
  children?: ItemModel[]
): ItemModel =>
  new ItemModel({
    id: title,
    isOpen: true,
    title: title,
    image: image,
    type: "YTplaylist",
    children: children && new ItemCollection(children),
  });

export const channel = (
  title: string,
  image: string,
  children?: ItemModel[]
): ItemModel =>
  new ItemModel({
    id: title,
    isOpen: true,
    title: title,
    image: image,
    type: "YTchannel",
    children: children && new ItemCollection(children),
  });
