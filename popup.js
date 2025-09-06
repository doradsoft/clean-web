/**
 * Popup script for Clean Web extension
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Get detected images from content script
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_STATS' });
    if (response) {
      updateStats(response);
    }
  } catch (error) {
    console.log('Could not get stats from content script:', error);
  }
  
  // Set up event listeners
  document.getElementById('refreshBtn').addEventListener('click', refreshStats);
  document.getElementById('settingsBtn').addEventListener('click', openSettings);
});

function updateStats(stats) {
  document.getElementById('imageCount').textContent = stats.totalImages || 0;
  document.getElementById('bgImageCount').textContent = stats.backgroundImages || 0;
}

async function refreshStats() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'REFRESH_STATS' });
    if (response) {
      updateStats(response);
    }
  } catch (error) {
    console.log('Could not refresh stats:', error);
  }
}

function openSettings() {
  // TODO: Implement settings page
  alert('Settings not implemented yet');
}