/**
 * Background service worker for the Clean Web Chrome extension
 * Handles extension lifecycle, settings management and cross-tab communication
 */

// Installation and update handler
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Clean Web extension installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    // Set default settings on first install
    chrome.storage.sync.set({
      nudityThreshold: 5,
      strictMode: false,
      allowList: [],
      blockList: []
    });
  }
});

// Message handler for communication with content scripts and popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Background received message:', message);
  
  switch (message.type) {
    case 'GET_SETTINGS':
      chrome.storage.sync.get({
        nudityThreshold: 5,
        strictMode: false,
        allowList: [],
        blockList: []
      }, sendResponse);
      return true; // Will respond asynchronously
      
    case 'UPDATE_SETTINGS':
      chrome.storage.sync.set(message.settings, () => {
        sendResponse({ success: true });
      });
      return true; // Will respond asynchronously
      
    case 'RELOAD_CONTENT_SCRIPTS':
      // Reload all tabs with content scripts
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            chrome.tabs.reload(tab.id);
          }
        });
      });
      sendResponse({ success: true });
      break;
      
    case 'IMAGE_DETECTED':
      // Handle image detection messages from comprehensive mutation observer
      console.log('Image detected via mutation observer:', message.data);
      sendResponse({ success: true });
      break;
      
    case 'STATS_UPDATE':
      // Handle stats updates from comprehensive image detection
      console.log('Clean Web stats updated:', message.data);
      sendResponse({ success: true });
      break;
      
    case 'GET_STATS':
      // Request stats from active tab
      if (sender.tab?.id) {
        chrome.tabs.sendMessage(sender.tab.id, { type: 'REQUEST_STATS' }, sendResponse);
        return true; // Will respond asynchronously
      }
      break;
      
    default:
      console.warn('Unknown message type:', message.type);
      sendResponse({ error: 'Unknown message type' });
  }
});

// Tab update handler to reinject content script if needed
chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Only inject on http/https pages
    if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
      console.log('Page loaded, content script should be active on:', tab.url);
    }
  }
});