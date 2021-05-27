import "@testing-library/jest-dom";
import { cls } from "../infra";
import { renderApp } from "./app";

it("App should render header of height 60px into container", () => {
  document.body.appendChild(renderApp());

  const header = document.getElementsByClassName(cls.header)[0];

  expect(header).toHaveStyle("height: 60px");
});
