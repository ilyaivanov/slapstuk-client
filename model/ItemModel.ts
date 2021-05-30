import Events from "./events";

type ItemAttributes = {
  id: string;
  title: string;
  isOpen: boolean;
  children?: ItemCollection;
  type: string;
  image?: string;
  videoId?: string;
};

type ItemEvents = {
  onVisibilityChange: boolean;
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
    //TODO: add loading indicator later
    const { children } = this.props;
    if (children) return children.items.length === 0;
    else return true;
  }
  get title() {
    return this.props.title;
  }

  get id() {
    return this.props.id;
  }

  toggleVisibility = () => {
    this.props.isOpen = !this.props.isOpen;
    this.events.trigger("onVisibilityChange", this.props.isOpen);
  };

  onVisibilityChange = (cb: Action<boolean>) =>
    this.events.on("onVisibilityChange", cb);

  get children() {
    return this.props.children;
  }

  unassignChildrenOpenCloseEvents = () => {
    const unassign = (item: ItemModel) => {
      item.events.offAll("onVisibilityChange");
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
