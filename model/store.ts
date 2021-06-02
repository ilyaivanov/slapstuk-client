import Events from "./events";
import { ItemCollection, ItemModel } from "./ItemModel";

type EventsTypes = {
  onHomeLoaded: ItemModel;
  onSearchLoaded: ItemModel;
  onSearchVisibilityChange: boolean;
  onThemeChange: Theme;
};

export type Theme = "dark" | "light";

export class Store {
  mainTabSelectedItemId?: string;
  searchTabSelectedItemId?: string;

  home?: ItemModel;
  search?: ItemModel;
  private events = new Events<EventsTypes>();
  isSearchVisible = false;

  toggleVisibility = () => {
    this.isSearchVisible = !this.isSearchVisible;
    this.events.trigger("onSearchVisibilityChange", this.isSearchVisible);
  };

  onVisiblityChange = (cb: Action<boolean>) =>
    this.events.on("onSearchVisibilityChange", cb);

  itemsLoaded = (home: ItemModel) => {
    this.home = home;
    this.events.trigger("onHomeLoaded", this.home);
  };

  onHomeLoaded = (cb: Action<ItemModel>) => this.events.on("onHomeLoaded", cb);

  onSearchLoaded = (cb: Action<ItemModel>) =>
    this.events.on("onSearchLoaded", cb);

  searchIsDone = (search: ItemModel) => {
    this.search = search;
    this.events.trigger("onSearchLoaded", search);
  };

  theme = "dark" as Theme;
  toggleTheme = () => {
    this.theme = this.theme == "dark" ? "light" : "dark";
    this.events.trigger("onThemeChange", this.theme);
  };

  onThemeChange = (cb: Action<Theme>) => {
    this.events.on("onThemeChange", cb);
  };
}

const createModel = (item: Item, items: Items): ItemModel => {
  const container = item as ItemContainer;
  const model = new ItemModel({
    children:
      "children" in item
        ? new ItemCollection(
            item.children.map((id) => createModel(items[id], items))
          )
        : undefined,
    title: item.title,
    type: item.type,
    isOpen: !container.isCollapsedInGallery || false,
    id: item.id,
  });
  // model.forEachChild((child) => child.setParent(model));
  return model;
};
