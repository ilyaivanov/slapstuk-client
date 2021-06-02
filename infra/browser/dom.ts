import { ClassName, ElementId } from "../index";

type Action<T> = (a: T) => void;

type KnownTarget<T> = {
  currentTarget: T;
};

export type EventOn<T extends HTMLElement> = Event & KnownTarget<T>;

export type KeyboardEventOn<T extends HTMLElement> = KeyboardEvent &
  KnownTarget<T>;

export type FocusEventOn<T extends HTMLElement> = FocusEvent & KnownTarget<T>;

export type ClassDefinitions = {
  className?: ClassName;
  classNames?: ClassName[];
  classMap?: Partial<Record<ClassName, boolean>>;
};
export type Events = {
  onClick?: (e: MouseEvent) => void;
  onMouseDown?: (e: MouseEvent) => void;
  onMouseMove?: (e: MouseEvent) => void;
  onEnter?: (e: Event) => void;
  onLeave?: (e: Event) => void;
};
type ElementProps = ClassDefinitions &
  Events & {
    testId?: string;
    id?: ElementId;
  };
export const assignClasses = (elem: Element, props: ClassDefinitions) => {
  if (props.className) elem.classList.add(props.className);
  if (props.classNames)
    props.classNames.forEach((cn) => elem.classList.add(cn));
  if (props.classMap) assignClassMap(elem, props.classMap);
};

export const assignClassMap = (
  elem: Element,
  classMap: Partial<Record<ClassName, boolean>>
) => {
  Object.entries(classMap).forEach(([className, isSet]) => {
    if (isSet) elem.classList.add(className);
    else elem.classList.remove(className);
  });
};

export const assignEvents = <T extends Element>(elem: T, props: Events): T => {
  //@ts-expect-error need to figure out way to handle there types for both HTML and SVG elements
  if (props.onClick) elem.addEventListener("click", props.onClick);
  //@ts-expect-error
  if (props.onMouseDown) elem.addEventListener("mousedown", props.onMouseDown);
  //@ts-expect-error
  if (props.onMouseMove) elem.addEventListener("mousemove", props.onMouseMove);
  if (props.onLeave) elem.addEventListener("mouseleave", props.onLeave);
  if (props.onEnter) elem.addEventListener("mouseenter", props.onEnter);
  return elem;
};

const assignElementProps = <T extends Element>(
  elem: T,
  props: ElementProps
): T => {
  assignClasses(elem, props);
  assignEvents(elem, props);
  if (props.testId) elem.setAttribute("data-testid", props.testId);
  const id = props.id;
  if (id) elem.id = id;
  return elem;
};

const appendChildren = <T extends Element>(
  elem: T,
  children: (Node | string | undefined)[] | undefined
): T => {
  children?.forEach((c) => {
    if (typeof c === "string") elem.append(c);
    else if (c) elem.appendChild(c);
  });

  return elem;
};
type DivProps = ElementProps & {
  children?: (Node | string | undefined)[];
};
export const div = (props: DivProps) =>
  assignElementProps(
    appendChildren(document.createElement("div"), props.children),
    props
  );

type InputProps = ElementProps & {
  onInput?: Action<EventOn<HTMLInputElement>>;
  onBlur?: Action<FocusEventOn<HTMLInputElement>>;
  onKeyDown?: Action<KeyboardEventOn<HTMLInputElement>>;
  value?: string;
  placeholder?: string;
};
export const input = (props: InputProps) => {
  const elem = assignElementProps(document.createElement("input"), props);
  if (props.onInput)
    elem.addEventListener("input", props.onInput as Action<Event>);
  if (props.onKeyDown)
    elem.addEventListener("keydown", props.onKeyDown as Action<Event>);
  if (props.onBlur)
    elem.addEventListener("blur", props.onBlur as Action<Event>);
  if (props.value) elem.value = props.value;
  if (props.placeholder) elem.placeholder = props.placeholder;
  return elem;
};

type SpanProps = ElementProps & {
  text: string;
};
export const span = (props: SpanProps) => {
  const elem = assignElementProps(document.createElement("span"), props);
  elem.textContent = props.text;
  return elem;
};

type ButtonProps = ElementProps & {
  text: string;
};
export const button = (props: ButtonProps) => {
  const elem = assignElementProps(document.createElement("button"), props);
  elem.textContent = props.text;
  return elem;
};

type ImgProps = ElementProps & {
  src: string;
};
export const img = (props: ImgProps) => {
  const elem = assignElementProps(document.createElement("img"), props);
  elem.src = props.src;
  return elem;
};

export const fragment = (nodes: (Node | undefined)[]): DocumentFragment => {
  const fragment = document.createDocumentFragment();
  nodes.forEach((node) => node && fragment.appendChild(node));
  return fragment;
};

//Utils
export const setChildren = <T extends Element>(
  elem: T,
  children: (Node | string | undefined)[]
): T => {
  removeChildren(elem);
  appendChildren(elem, children);
  return elem;
};

export const setChild = <T extends Element>(
  elem: T,
  child: Node | string
): T => {
  removeChildren(elem);
  appendChild(elem, child);
  return elem;
};

export const removeChildren = (elem: Element) => {
  while (elem.firstChild) elem.firstChild.remove();
};

const appendChild = <T extends Element>(
  elem: T,
  child: Node | string | undefined
) => {
  if (typeof child === "string") elem.append(child);
  else if (child) elem.appendChild(child);
  return elem;
};
