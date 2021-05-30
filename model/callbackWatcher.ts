import { Store } from "./store";

export const initItemModelToMemoryLeakDetector = (store: Store) => {
  document.addEventListener("keydown", (e) => {
    if (e.altKey && e.code == "KeyV") {
      const home = store.home;
      if (home) {
        const { callbacksCount, modelsCount, callbacksCountByEvents } =
          home.getTotalNumberOfListeners();
        console.log(
          `${modelsCount} models and in total ${callbacksCount} callbacks`
        );

        console.log(`Events: `, callbacksCountByEvents);
      }
    }
  });
};
