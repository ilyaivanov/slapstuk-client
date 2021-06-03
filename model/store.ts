import { emptyFolder, folder } from "../api/itemsBuilder";
import Events from "./events";
import { ItemCollection, ItemModel } from "./ItemModel";

type EventsTypes = {
  onHomeLoaded: ItemModel;
  onSearchLoaded: ItemModel;
  onSearchVisibilityChange: boolean;
  onThemeChange: Theme;
};

export type Theme = "dark" | "light";
export type Tab = "main" | "search";

export class Store {
  mainTabSelectedItem?: ItemModel;
  searchTabSelectedItemId?: ItemModel;

  home?: ItemModel;
  search?: ItemModel;
  private events = new Events<EventsTypes>();
  isSearchVisible = false;
  tabFocused = "main" as Tab;

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

  createItem = () => {
    if (this.mainTabSelectedItem) {
      const newItem = emptyFolder();
      newItem.parent = this.mainTabSelectedItem;
      this.mainTabSelectedItem.parent!.children!.addItemAfter(
        this.mainTabSelectedItem,
        newItem
      );
      this.selectItem(newItem);
      newItem.startRename();
    }
  };
  //Navigation

  moveSelectionUp = () => {
    if (!this.selectFirstIfNoneIsSelected()) {
      const previousItem = this.mainTabSelectedItem!.getItemAbove();
      previousItem && this.selectItem(previousItem);
    }
  };

  moveSelectionDown = () => {
    if (!this.selectFirstIfNoneIsSelected()) {
      const nextItem = this.mainTabSelectedItem!.getItemBelow();
      nextItem && this.selectItem(nextItem);
    }
  };

  moveSelectionLeft = () => {
    if (!this.selectFirstIfNoneIsSelected()) {
      if (this.mainTabSelectedItem?.isOpen)
        this.mainTabSelectedItem?.toggleVisibility();
      else {
        const parent = this.mainTabSelectedItem!.parent;
        if (parent && !parent.isRoot()) this.selectItem(parent);
      }
    }
  };

  moveSelectionRight = () => {
    if (!this.selectFirstIfNoneIsSelected()) {
      if (!this.mainTabSelectedItem?.isOpen)
        this.mainTabSelectedItem?.toggleVisibility();
      else {
        const firstChild = this.mainTabSelectedItem!.getFirstChild();
        if (firstChild) this.selectItem(firstChild);
      }
    }
  };

  selectItem = (item: ItemModel) => {
    if (this.mainTabSelectedItem)
      this.mainTabSelectedItem.triggerSelectionEvent(false);
    this.mainTabSelectedItem = item;
    this.mainTabSelectedItem.triggerSelectionEvent(true);
  };

  //returns true if selection was changed
  //postcondition: this.mainTabSelectedItem is always defined
  private selectFirstIfNoneIsSelected = (): boolean => {
    if (!this.mainTabSelectedItem) {
      const firstItem = this.home!.children?.items[0]!;
      this.mainTabSelectedItem = firstItem;
      firstItem.triggerSelectionEvent(true);
      return true;
    }
    return false;
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
