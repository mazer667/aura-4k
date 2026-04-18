import { imgPath, shotPath } from "./games.js";
import { preloadImage } from "./imageCache.js";
const PRELOAD_RANGE = 3;
function preloadAdjacentGames(currentIndex, games) {
  if (!games?.length) return;
  const indices = [];
  for (let i = -PRELOAD_RANGE; i <= PRELOAD_RANGE; i++) {
    if (i === 0) continue;
    const idx = (currentIndex + i + games.length) % games.length;
    if (!indices.includes(idx)) {
      indices.push(idx);
    }
  }
  requestIdleCallback?.(() => {
    indices.forEach((i) => {
      const game = games[i];
      if (!game) return;
      const centerUrl = imgPath(game);
      const shot1 = shotPath(game, 1);
      const shot2 = shotPath(game, 2);
      const shot3 = shotPath(game, 3);
      preloadImage(centerUrl);
      preloadImage(shot1);
      preloadImage(shot2);
      preloadImage(shot3);
    });
  }, { timeout: 2000 });
}
function preloadBackgrounds(prevGame, currGame, nextGame) {
  requestIdleCallback?.(() => {
    if (prevGame) preloadImage(imgPath(prevGame));
    if (currGame) preloadImage(imgPath(currGame));
    if (nextGame) preloadImage(imgPath(nextGame));
  }, { timeout: 1000 });
}
const preloadQueue = [];
let isProcessing = false;
const BATCH_SIZE = 3;
function processQueue() {
  if (isProcessing || preloadQueue.length === 0) return;
  isProcessing = true;
  const batch = preloadQueue.splice(0, BATCH_SIZE);
  Promise.all(batch.map((item) => preloadImage(item.url))).finally(() => {
    isProcessing = false;
    if (preloadQueue.length > 0) {
      requestIdleCallback?.(() => processQueue()) || setTimeout(processQueue, 100);
    }
  });
}
function queuePreload(url, priority = 0) {
  if (!url) return;
  const existing = preloadQueue.findIndex((item) => item.url === url);
  if (existing !== -1) {
    preloadQueue.splice(existing, 1);
  }
  preloadQueue.unshift({ url, priority });
  if (preloadQueue.length > 50) {
    preloadQueue.length = 50;
  }
  processQueue();
}
function clearPreloadQueue() {
  preloadQueue.length = 0;
}
export {
  clearPreloadQueue,
  preloadAdjacentGames,
  preloadBackgrounds,
  queuePreload
};
