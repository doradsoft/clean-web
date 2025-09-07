// Background script for Clean Web extension
console.log('Clean Web extension background script loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Clean Web extension installed');
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'IMAGE_DETECTED') {
    console.log('Image detected:', request.data);
  }
  sendResponse({ success: true });
});