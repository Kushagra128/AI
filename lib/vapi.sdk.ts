import Vapi from "@vapi-ai/web";

// Add TypeScript definition for webkit prefixed AudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

// Check browser compatibility
const checkBrowserCompatibility = () => {
  // Check if running in browser environment
  if (typeof window === 'undefined') return true;

  // Check audio support
  const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  // Check Web Audio API support
  const hasAudioContext = !!(window.AudioContext || window.webkitAudioContext);

  return hasMediaDevices && hasAudioContext;
};

// Initialize the VAPI SDK with your API key
const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY || process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN || "";

// Create VAPI instance with error handling
// Note: The second parameter is actually the constructor options in newer versions
const vapiOptions = checkBrowserCompatibility() ? undefined : { disableInputProcessors: ['audio'] };
export const vapi = new Vapi(apiKey, vapiOptions as any);

// Add global error handler
vapi.on("error", (error) => {
  console.error("VAPI global error handler:", error);
});

// Log initialization status
if (apiKey) {
  try {
    console.log("VAPI SDK initialized successfully");
    console.log("Browser compatibility:", checkBrowserCompatibility() ? "Full support" : "Limited support");
  } catch (error) {
    console.error("VAPI SDK initialization error:", error);
  }
}
