// js/batchUpdate.js
// Système de batch DOM updates pour éviter les re-renders multiples

let pending = null;
let rafId = null;

export function batchUpdate(callback) {
  if (!pending) {
    pending = { props: [], style: [], html: [], events: [] };
  }
  
  callback(pending);
  scheduleFlush();
}

export function setProperty(element, prop, value) {
  if (!element) return;
  batchUpdate(batch => {
    batch.props.push({ element, prop, value });
  });
}

export function setStyle(element, styles) {
  if (!element) return;
  batchUpdate(batch => {
    batch.style.push({ element, styles });
  });
}

export function setHTML(element, html) {
  if (!element) return;
  batchUpdate(batch => {
    batch.html.push({ element, html });
  });
}

function scheduleFlush() {
  if (rafId) return;
  rafId = requestAnimationFrame(flush);
}

function flush() {
  rafId = null;
  if (!pending) return;
  
  const batch = pending;
  pending = null;
  
  for (const { element, prop, value } of batch.props) {
    if (element[prop] !== value) {
      element[prop] = value;
    }
  }
  
  for (const { element, styles } of batch.style) {
    Object.assign(element.style, styles);
  }
  
  for (const { element, html } of batch.html) {
    element.innerHTML = html;
  }
}

export function cancelBatch() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  pending = null;
}

export function sync(callback) {
  cancelBatch();
  callback();
}
