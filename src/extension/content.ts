import { CleanWebCore } from '@/business-logic';
import { FilterSettings } from '@/types';

// Initialize Clean Web in the content script
console.log('Clean Web content script loaded');

// Default settings for the extension
const defaultSettings: FilterSettings = {
  nudityThreshold: 5,
  strictMode: false,
  allowList: [],
  blockList: []
};

// Initialize Clean Web Core
const cleanWebCore = new CleanWebCore(defaultSettings);

// Start the image detection system
cleanWebCore.start().then(() => {
  console.log('Clean Web Core started successfully');
  
  // Send message to background script with current stats
  chrome.runtime.sendMessage({
    type: 'IMAGE_DETECTED',
    data: cleanWebCore.getStats()
  });
}).catch(error => {
  console.error('Failed to start Clean Web Core:', error);
});

// Periodically update stats (for demo purposes)
setInterval(() => {
  const stats = cleanWebCore.getStats();
  console.log('Clean Web stats:', stats);
  
  chrome.runtime.sendMessage({
    type: 'STATS_UPDATE',
    data: stats
  });
}, 5000);