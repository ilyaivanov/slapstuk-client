import "@testing-library/jest-dom";

jest.mock("../infra/browser/anim", () => ({
  animate: () => ({
    addEventListener: (name: string, cb: any) => cb(),
  }),
}));

jest.mock("../api/itemsLoader", () => ({
  loadItemChildren: jest.fn(),
  searchItems: jest.fn(),
}));
