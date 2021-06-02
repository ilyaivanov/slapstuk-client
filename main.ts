import "./infra/browser/normalize";
import { renderApp } from "./app/app";
import { Store } from "./model/store";
import { home, folder, video, channel, playlist } from "./api/itemsBuilder";
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
      folder("Trance here"),
      folder("Trance everywhere"),
    ]),
    folder("Metal"),
    folder("Ambient"),
    folder("Piano"),
  ]),
  folder("Software Development"),
  folder("People"),
  folder("Channels"),
  folder("General Talks"),
  folder("Standup", [
    video("Louis CK @ The Improv", "X0IV_ZB9CDs"),
    channel(
      "Comedy Central Stand-Up",
      "https://yt3.ggpht.com/ytc/AAUvwngG7NAXO82rv-z6NreBfJGbCDcIDZThdwrHZ-C7=s88-c-k-c0x00ffffff-no-rj"
    ),
    playlist(
      "Best Standup Comedians + TheLaughFactory",
      "https://i.ytimg.com/vi/j6--kTcODn8/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCVUN02za5Zr1H-7RBS9bAUp-LJpA"
    ),
  ]),
  folder("Deep work"),
]);
