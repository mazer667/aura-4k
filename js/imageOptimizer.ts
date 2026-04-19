// js/imageOptimizer.js
// Optimisation des images - conversion WebP et compression

const imageCache = new Map();
const MAX_CACHE_SIZE = 100;

export async function convertToWebP(imageUrl, quality = 0.85) {
  const cacheKey = `${imageUrl}:${quality}`;
  
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }
  
  if (imageCache.size >= MAX_CACHE_SIZE) {
    const firstKey = imageCache.keys().next().value;
    imageCache.delete(firstKey);
  }
  
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            imageCache.set(cacheKey, { url, blob, size: blob.size });
            resolve(url);
          } else {
            resolve(imageUrl);
          }
        },
        'image/webp',
        quality
      );
    };
    
    img.onerror = () => resolve(imageUrl);
    img.src = imageUrl;
  });
}

const MAX_CONCURRENT_OPT = 3;

export async function preloadAsWebP(urls, quality = 0.85) {
  const results: string[] = [];
  
  for (let i = 0; i < urls.length; i += MAX_CONCURRENT_OPT) {
    const batch = urls.slice(i, i + MAX_CONCURRENT_OPT);
    const batchResults = await Promise.all(batch.map(url => convertToWebP(url, quality)));
    results.push(...batchResults);
    
    if (i + MAX_CONCURRENT_OPT < urls.length && 'requestIdleCallback' in window) {
      await new Promise(resolve => (window as any).requestIdleCallback(resolve, { timeout: 1000 }));
    }
  }
  
  return results;
}

export function getOptimizationStats() {
  let totalOriginal = 0;
  let totalOptimized = 0;
  
  imageCache.forEach(entry => {
    totalOriginal += entry.size * 2.5;
    totalOptimized += entry.size;
  });
  
  return {
    cached: imageCache.size,
    maxSize: MAX_CACHE_SIZE,
    estimatedSavings: `${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%`
  };
}

export function clearOptimizedCache() {
  imageCache.forEach(entry => {
    if (entry.url.startsWith('blob:')) {
      URL.revokeObjectURL(entry.url);
    }
  });
  imageCache.clear();
}

export function getImageInfo(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: (img.naturalWidth / img.naturalHeight).toFixed(2)
      });
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export function generateThumbnail(url, maxWidth = 400, maxHeight = 300) {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      
      let width = img.naturalWidth;
      let height = img.naturalHeight;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          } else {
            resolve(url);
          }
        },
        'image/webp',
        0.7
      );
    };
    
    img.onerror = () => resolve(url);
    img.src = url;
  });
}
