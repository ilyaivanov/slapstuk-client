export default class App {
  constructor(private el: Element) {
    const div = document.createElement("div");
    div.textContent = "Hello World";

    el.appendChild(div);
  }
}
