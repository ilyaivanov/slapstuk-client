import "./infra/normalize";
import { renderApp } from "./app/app";
import { Store } from "./model/store";
import { buildItems } from "./api/itemsBuilder";
import { initThemes } from "./infra";
import { initItemModelToMemoryLeakDetector } from "./model/callbackWatcher";

initThemes();
const store = new Store();
document.body.appendChild(renderApp(store));

initItemModelToMemoryLeakDetector(store);

//make sure we can render without data
//fix loading after I'm done with a list
setTimeout(() => {
  store.itemsLoaded(
    buildItems(`
    HOME
        Music
           Subfirst1
            Subfirst1_Child_one
           Subfirst2
        Software Development
        People
        Standup
        Channels
        General Talks
        Deep_work
    `)
  );
}, 10);
