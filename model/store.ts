import Events from "./events";
import { ItemCollection, ItemModel } from "./ItemModel";

type EventsTypes = {
  onHomeLoaded: ItemModel;
  onSearchVisibilityChange: boolean;
};

export class Store {
  private home?: ItemModel;
  private events = new Events<EventsTypes>();
  isSearchVisible = false;

  toggleVisibility = () => {
    this.isSearchVisible = !this.isSearchVisible;
    this.events.trigger("onSearchVisibilityChange", this.isSearchVisible);
  };

  onVisiblityChange = (cb: Action<boolean>) =>
    this.events.on("onSearchVisibilityChange", cb);

  itemsLoaded = (items: Items) => {
    this.home = this.createModel(items["HOME"], items);
    this.events.trigger("onHomeLoaded", this.home);
  };

  createModel = (item: Item, items: Items): ItemModel => {
    const container = item as ItemContainer;
    const model = new ItemModel({
      children:
        "children" in item
          ? new ItemCollection(
              item.children.map((id) => this.createModel(items[id], items))
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

  onHomeLoaded = (cb: Action<ItemModel>) => this.events.on("onHomeLoaded", cb);
}
