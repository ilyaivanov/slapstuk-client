type ItemAttributes = {
  id: string;
  title: string;
  isOpen: boolean;
  children?: ItemCollection;
  type: string;
  image?: string;
  videoId?: string;
};

export class ItemModel {
  constructor(private props: ItemAttributes) {}
  mapChildren = <T>(map: Func1<ItemModel, T>): T[] => {
    const c = this.props.children;
    if (c) return c.items.map(map);
    else return [];
  };

  get isOpen() {
    return this.props.isOpen;
  }
  get title() {
    return this.props.title;
  }

  get id() {
    return this.props.id;
  }
}

export class ItemCollection {
  constructor(public items: ItemModel[]) {}
}
