import "./infra/normalize";
import { renderApp } from "./app/app";
import { Store } from "./model/store";
import { home, folder } from "./api/itemsBuilder";
import { initThemes } from "./infra";
import { initItemModelToMemoryLeakDetector } from "./model/callbackWatcher";

initThemes();
const store = new Store();
document.body.appendChild(renderApp(store));

initItemModelToMemoryLeakDetector(store);

//make sure we can render without data
//fix loading after I'm done with a list
setTimeout(() => {
  store.itemsLoaded(newItems);
}, 10);

const newItems = home([
  folder("Music", [
    folder("Electro", [
      folder("Trance this"),
      folder("Trance that"),
      folder("Trance there"),
      folder("Trance and here"),
      folder("Trance and there"),
    ]),
    folder("Metal"),
    folder("Ambient"),
    folder("Piano"),
  ]),
  folder("Software Development"),
  folder("People"),
  folder("Channels"),
  folder("General Talks"),
  folder("Deep work"),
]);
