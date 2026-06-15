import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const tokens = {
  colors: {
    ink: '#000000', canvas: '#ffffff', inverseCanvas: '#000000', inverseInk: '#ffffff',
    hairline: '#e6e6e6', hairlineSoft: '#f1f1f1', surfaceSoft: '#f7f7f5',
    blockLime: '#dceeb1', blockLilac: '#c5b0f4', blockCream: '#f4ecd6', blockPink: '#efd4d4',
    blockMint: '#c8e6cd', blockCoral: '#f3c9b6', blockNavy: '#1f1d3d',
    accentMagenta: '#ff3d8b', semanticSuccess: '#1ea64a', overlayScrim: '#000000',
  },
  spacing: {
    hair: '1px', xxs: '4px', xs: '8px', sm: '12px', md: '16px', lg: '24px', xl: '32px', xxl: '48px', section: '96px',
  },
  rounded: {
    xs: '2px', sm: '6px', md: '8px', lg: '24px', xl: '32px', pill: '50px', full: '9999px',
  },
} as const;
