/**
 * Clean Web Background Service Worker
 * Handles extension lifecycle and messaging
 */

// Stats storage
let currentStats = {
  totalImages: 0,
  backgroundImages: 0,
  imgElements: 0
};

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'STATS_UPDATE') {
    currentStats = message.stats;
    console.log('Background: Stats updated', currentStats);
  } else if (message.type === 'GET_STATS') {
    sendResponse(currentStats);
  }
  
  return true;
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Clean Web Extension installed');
});

// Handle tab updates to reset stats
chrome.tabs.onUpdated.addListener((_tabId, changeInfo, _tab) => {
  if (changeInfo.status === 'loading') {
    currentStats = {
      totalImages: 0,
      backgroundImages: 0,
      imgElements: 0
    };
  }
});