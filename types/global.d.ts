/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}
