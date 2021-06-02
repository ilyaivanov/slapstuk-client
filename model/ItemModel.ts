import { loadItemChildren } from "../api/itemsLoader";
import Events from "./events";

type ItemAttributes = {
  id: string;
  title: string;
  isOpen: boolean;
  children?: ItemCollection;
  type: string;
  image?: string;
  videoId?: string;
  isLoading?: boolean;
};

type ItemEvents = {
  onVisibilityChange: boolean;
  onItemLoaded: ItemModel;
  onSelectionChange: boolean;
};

export class ItemModel {
  public parent?: ItemModel;
  events = new Events<ItemEvents>();
  constructor(private props: ItemAttributes) {
    if (props.children)
      props.children.items.forEach((item) => (item.parent = this));
  }

  mapChildren = <T>(map: Func1<ItemModel, T>): T[] => {
    const c = this.props.children;
    if (c) return c.items.map(map);
    else return [];
  };

  forEachChild = (action: Action<ItemModel>) => {
    const c = this.props.children;
    if (c) c.items.forEach(action);
  };

  get isOpen() {
    return this.props.isOpen;
  }
  get isEmptyNoNeedToLoad() {
    const { children } = this.props;

    if (this.isPlaylist || this.isChannel) return false;

    if (children) return children.items.length === 0;
    else return true;
  }
  get isNeededToInitiateChildrenFetch() {
    const { children } = this.props;
    if (this.isLoading) return false;

    if (this.isPlaylist || this.isChannel) {
      if (children) return children.items.length === 0;
      else return true;
    }
    return false;
  }
  get isLoading() {
    return this.props.isLoading;
  }

  get title() {
    return this.props.title;
  }

  get id() {
    return this.props.id;
  }

  get children() {
    return this.props.children;
  }

  get hasImage(): boolean {
    return !!(this.props.image || this.props.videoId);
  }

  get isVideo() {
    return this.props.type === "YTvideo";
  }
  get isPlaylist() {
    return this.props.type === "YTplaylist";
  }
  get isChannel() {
    return this.props.type === "YTchannel";
  }

  toggleVisibility = () => {
    if (!this.props.isOpen && this.isNeededToInitiateChildrenFetch) {
      this.props.isLoading = true;
      loadItemChildren(this);
    }
    this.props.isOpen = !this.props.isOpen;
    this.events.trigger("onVisibilityChange", this.props.isOpen);
  };

  onVisibilityChange = (cb: Action<boolean>) =>
    this.events.on("onVisibilityChange", cb);

  onSelectionChange = (cb: Action<boolean>) =>
    this.events.on("onSelectionChange", cb);

  onItemLoaded = (cb: Action<ItemModel>) => this.events.on("onItemLoaded", cb);

  triggerSelectionEvent = (isSelected: boolean) =>
    this.events.trigger("onSelectionChange", isSelected);

  get previewImage() {
    const { image, videoId } = this.props;
    if (videoId) return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
    else if (image) return image;
    else return "";
  }

  itemsLoaded = (items: ItemModel[]) => {
    this.props.children = new ItemCollection(items);
    this.props.isLoading = false;
    this.events.trigger("onItemLoaded", this);
  };

  unassignChildrenOpenCloseEvents = () => {
    const unassign = (item: ItemModel) => {
      item.events.offAll("onVisibilityChange");
      item.events.offAll("onItemLoaded");
      item.events.offAll("onSelectionChange");
      item.forEachChild(unassign);
    };
    this.forEachChild(unassign);
  };

  //TRAVERSAL
  //this goes down into children
  getItemBelow = (): ItemModel | undefined => {
    if (this.isOpen && this.children) return this.children?.items[0];

    const followingItem = this.getFollowingItem();
    if (followingItem) return followingItem;
    else {
      let parent: ItemModel | undefined = this.parent;
      while (parent && parent.isLast()) {
        parent = parent.parent;
      }
      if (parent) return parent.getFollowingItem();
    }
  };

  getItemAbove = (): ItemModel | undefined => {
    const previous = this.getPreviousItem();
    if (previous && previous.isOpen) return previous.getLastNestedItem();
    else if (previous) return previous;
    else if (!this.parent?.isRoot()) return this.parent;
  };

  //this always returns following item without going down to children
  getFollowingItem = (): ItemModel | undefined => {
    const parent = this.parent;
    if (parent) {
      const context: ItemModel[] = parent.children!.items;
      const index = context.indexOf(this);
      if (index < context.length - 1) {
        return context[index + 1];
      }
    }
  };
  //this always returns following item without going down to children
  getPreviousItem = (): ItemModel | undefined => {
    const parent = this.parent;
    if (parent) {
      const context: ItemModel[] = parent.children!.items;
      const index = context.indexOf(this);
      if (index > 0) {
        return context[index - 1];
      }
    }
  };

  getLastNestedItem = (): ItemModel => {
    if (this.isOpen && this.children) {
      const { items } = this.children;
      return items[items.length - 1].getLastNestedItem();
    }
    return this;
  };

  isLast = (): boolean => !this.getFollowingItem();

  isRoot = () => this.parent == undefined;

  //MEMORY LEAK DETECTION
  getTotalNumberOfListeners = () => {
    let modelsCount = 0;
    let callbacksCount = 0;
    let callbacksCountByEvents: Record<string, number> = {};

    const traverseModel = (model: ItemModel) => {
      modelsCount += 1;
      callbacksCount += Object.values(model.events.events).reduce(
        (count, arr) => count + arr.length,
        0
      );
      const childCollection = model.children;
      if (childCollection) {
        // callbacksCount += Object.values(childCollection.events).reduce(
        //   (count, arr) => count + arr.length,
        //   0
        // );
        // Object.entries(childCollection.events).forEach(([key, value]) => {
        //   callbacksCountByEvents[key] =
        //     (callbacksCountByEvents[key] || 0) + value.length;
        // });
      }

      Object.entries(model.events.events).forEach(([key, value]) => {
        callbacksCountByEvents[key] =
          (callbacksCountByEvents[key] || 0) + value.length;
      });
      model.forEachChild(traverseModel);
    };

    this.forEachChild(traverseModel);

    return {
      modelsCount,
      callbacksCount,
      callbacksCountByEvents,
    };
  };
}

export class ItemCollection {
  constructor(public items: ItemModel[]) {}
}
