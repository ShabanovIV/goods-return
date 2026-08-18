declare const __API_URL__: string;
declare const __DEVELOPMENT_TOKEN__: string | undefined;

// CSS Modules
declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

// Global SCSS (например globals.scss) — просто чтобы TS не ругался
declare module '*.scss';

// Images (возвращаем URL строки)
declare module '*.ico' {
  const src: string;
  export default src;
}
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.jpeg' {
  const src: string;
  export default src;
}
declare module '*.gif' {
  const src: string;
  export default src;
}
declare module '*.webp' {
  const src: string;
  export default src;
}
declare module '*.avif' {
  const src: string;
  export default src;
}

// SVG: 2 сценария
// 1) import iconUrl from "./icon.svg" -> string url
// 2) import { ReactComponent as Icon } from "./icon.svg" -> React component
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>;
  const src: string;
  export default src;
}
