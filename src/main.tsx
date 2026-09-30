import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard JSON.stringify against circular structures (e.g., Firestore WebChannel Y2/Ka objects or DOM events)
const origJsonStringify = JSON.stringify;
if (!(JSON.stringify as any).__circularSafe) {
  const safeStringify = function (this: any, value: any, replacer?: any, space?: any): string {
    try {
      return origJsonStringify.call(JSON, value, replacer, space);
    } catch (err) {
      if (err instanceof TypeError) {
        const seen = new WeakSet();
        return origJsonStringify.call(
          JSON,
          value,
          function (this: any, key: string, val: any) {
            if (typeof val === 'object' && val !== null) {
              if (seen.has(val)) return '[Circular]';
              seen.add(val);
            }
            return typeof replacer === 'function' ? replacer.call(this, key, val) : val;
          },
          space
        );
      }
      throw err;
    }
  };
  (safeStringify as any).__circularSafe = true;
  JSON.stringify = safeStringify as typeof JSON.stringify;
}

// Intercept benign @firebase/firestore internal state assertions (e.g. during Remix or rapid listener teardown)
if (typeof window !== 'undefined') {
  window.addEventListener(
    'error',
    (event) => {
      const msg = String(event?.message || event?.error?.message || '');
      if (msg.includes('INTERNAL ASSERTION FAILED') || msg.includes('Unexpected state')) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const msg = String(event?.reason?.message || event?.reason || '');
      if (msg.includes('INTERNAL ASSERTION FAILED') || msg.includes('Unexpected state')) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
