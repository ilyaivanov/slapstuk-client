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
};

export class ItemModel {
  events = new Events<ItemEvents>();
  constructor(private props: ItemAttributes) {}
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

  onItemLoaded = (cb: Action<ItemModel>) => this.events.on("onItemLoaded", cb);

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
      item.forEachChild(unassign);
    };
    this.forEachChild(unassign);
  };

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
