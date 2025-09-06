/**
 * Background service worker for Clean Web extension
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('Clean Web extension installed');
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'IMAGE_DETECTED') {
    console.log('Image detected:', request.data);
    // TODO: Here we could store detected images, send to classification service, etc.
  }
});