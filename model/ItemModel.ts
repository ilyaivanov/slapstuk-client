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
  private events = new Events<ItemEvents>();
  constructor(private props: ItemAttributes) {}
  mapChildren = <T>(map: Func1<ItemModel, T>): T[] => {
    const c = this.props.children;
    if (c) return c.items.map(map);
    else return [];
  };

  get isOpen() {
    return this.props.isOpen;
  }
  get isEmptyNoNeedToLoad() {
    //TODO: add loading indicator later
    return this.props.children?.items.length == 0;
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
}

export class ItemCollection {
  constructor(public items: ItemModel[]) {}
}
