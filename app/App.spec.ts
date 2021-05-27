import App from "./App";

it("App should render 'Hello World' into container", () => {
  const container = document.createElement("div");
  new App(container);
  expect(container.textContent).toEqual("Hello World");
});
