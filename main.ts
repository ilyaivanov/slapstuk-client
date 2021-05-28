import "./infra/normalize";
import { renderApp } from "./app/app";
import { Store } from "./model/store";
import { buildItems } from "./api/itemsBuilder";

const store = new Store();
document.body.appendChild(renderApp(store));

setTimeout(() => {
  store.itemsLoaded(
    buildItems(`
    HOME
        first
        second
        third
        fourth
    `)
  );
}, 1000);
