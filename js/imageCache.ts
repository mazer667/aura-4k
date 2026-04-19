// js/imageCache.js
// Cache d'images intelligent avec lazy loading et placeholder

import { CACHE } from './constants.js';

const imageCache = new Map();
const loadingSet = new Set();
const MAX_CACHE_SIZE = 300;
const MAX_CONCURRENT_LOADS = 4;
const loadQueue: Array<() => void> = [];
let activeLoads = 0;

const PLACEHOLDER_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23111' width='400' height='300'/%3E%3Ctext x='200' y='155' font-family='sans-serif' font-size='14' fill='%23333' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

export function getCachedImage(url) {
  if (!url) return null;
  
  if (imageCache.has(url)) {
    const cached = imageCache.get(url);
    cached.lastAccess = Date.now();
    return cached.element;
  }
  
  if (loadingSet.has(url)) return null;
  
  return null;
}

function _processQueue() {
  while (activeLoads < MAX_CONCURRENT_LOADS && loadQueue.length > 0) {
    const next = loadQueue.shift();
    if (next) next();
  }
}

export function preloadImage(url) {
  if (!url) return Promise.resolve();
  
  if (imageCache.has(url)) {
    return Promise.resolve(imageCache.get(url).element);
  }
  
  if (loadingSet.has(url)) {
    return new Promise(resolve => {
      const checkLoaded = setInterval(() => {
        if (imageCache.has(url)) {
          clearInterval(checkLoaded);
          resolve(imageCache.get(url).element);
        }
      }, 50);
    });
  }
  
  return new Promise((resolve) => {
    const load = () => {
      activeLoads++;
      loadingSet.add(url);
      const img = new Image();
      
      img.onload = () => {
        imageCache.set(url, {
          element: img,
          loaded: true,
          lastAccess: Date.now()
        });
        loadingSet.delete(url);
        cleanupCache();
        activeLoads--;
        resolve(img);
        _processQueue();
      };
      
      img.onerror = () => {
        loadingSet.delete(url);
        activeLoads--;
        resolve(null);
        _processQueue();
      };
      
      img.src = url;
    };
    
    if (activeLoads >= MAX_CONCURRENT_LOADS) {
      loadQueue.push(load);
    } else {
      load();
    }
  });
}

export async function preloadImages(urls, maxBatch = 6) {
  const results: (HTMLImageElement | null)[] = [];
  for (let i = 0; i < urls.length; i += maxBatch) {
    const batch = urls.slice(i, i + maxBatch);
    const batchResults = await Promise.all(batch.map(url => preloadImage(url)));
    results.push(...batchResults);
  }
  return results;
}

export function isImageCached(url) {
  return imageCache.has(url);
}

export function isImageLoading(url) {
  return loadingSet.has(url);
}

function cleanupCache() {
  if (imageCache.size <= MAX_CACHE_SIZE) return;
  
  const entries = [...imageCache.entries()]
    .sort((a, b) => a[1].lastAccess - b[1].lastAccess);
  
  const toRemove = entries.slice(0, imageCache.size - MAX_CACHE_SIZE);
  toRemove.forEach(([url]) => imageCache.delete(url));
}

export function setImageToElement(element, url) {
  if (!element || !url) return;
  
  const cached = getCachedImage(url);
  if (cached) {
    element.src = cached.src;
    return;
  }
  
  element.style.backgroundImage = `url('${url}')`;
  
  preloadImage(url).then(img => {
    if (!img) {
      element.style.backgroundImage = `url('${PLACEHOLDER_SVG}')`;
    }
  });
}

export function setBackgroundWithPlaceholder(element, url) {
  if (!element) return;
  
  if (!url || isImageLoading(url)) {
    element.style.backgroundImage = `url('${PLACEHOLDER_SVG}')`;
    return;
  }
  
  const cached = getCachedImage(url);
  if (cached) {
    element.style.backgroundImage = `url('${cached.src}')`;
    return;
  }
  
  element.style.backgroundImage = `url('${PLACEHOLDER_SVG}')`;
  
  preloadImage(url).then(img => {
    if (img) {
      element.style.backgroundImage = `url('${img.src}')`;
    }
  });
}

export function clearCache() {
  imageCache.clear();
}

export function getCacheStats() {
  return {
    cached: imageCache.size,
    loading: loadingSet.size,
    maxSize: MAX_CACHE_SIZE
  };
}

