export {};

declare global {
  interface Window {
    onUnityMessage?: (message: { type: string; data?: string }) => void;
  }
}
