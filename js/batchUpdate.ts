// js/batchUpdate.js
// Système de batch DOM updates pour éviter les re-renders multiples

interface Batch {
  props: Array<{ element: HTMLElement; prop: string; value: any }>;
  style: Array<{ element: HTMLElement; styles: Partial<CSSStyleDeclaration> }>;
  html: Array<{ element: HTMLElement; html: string }>;
  events: Array<any>;
}

let pending: Batch | null = null;
let rafId: number | null = null;

export function batchUpdate(callback: (batch: Batch) => void) {
  if (!pending) {
    pending = { props: [], style: [], html: [], events: [] };
  }
  
  callback(pending);
  scheduleFlush();
}

export function setProperty(element: HTMLElement | null, prop: string, value: any) {
  if (!element) return;
  batchUpdate(batch => {
    batch.props.push({ element, prop, value });
  });
}

export function setStyle(element: HTMLElement | null, styles: Partial<CSSStyleDeclaration>) {
  if (!element) return;
  batchUpdate(batch => {
    batch.style.push({ element, styles });
  });
}

export function setHTML(element: HTMLElement | null, html: string) {
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
    if ((element as any)[prop] !== value) {
      (element as any)[prop] = value;
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

export function sync(callback: () => void) {
  cancelBatch();
  callback();
}
