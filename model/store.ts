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
    const homeItem = items["HOME"];
    if ("children" in homeItem) {
      const roots = homeItem.children.map((id) => items[id]);
      const home = new ItemModel({
        id: "HOME",
        isOpen: true,
        title: "Home",
        type: "folder",
        children: new ItemCollection(
          roots.map(
            (item) =>
              new ItemModel({
                id: item.id,
                isOpen: false,
                title: item.title,
                type: "folder",
              })
          )
        ),
      });
      this.home = home;
      this.events.trigger("onHomeLoaded", this.home);
    }
  };

  onHomeLoaded = (cb: Action<ItemModel>) => this.events.on("onHomeLoaded", cb);
}
