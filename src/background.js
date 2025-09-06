// Clean Web Background Service Worker
console.log('Clean Web background service worker loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('Clean Web extension installed');
    
    // Set default settings
    chrome.storage.sync.set({
        enabled: true,
        nudityThreshold: 0.3,
        hideImagesOnLoad: true
    });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background received message:', request);
    
    if (request.action === 'classifyImage') {
        // Placeholder for image classification API call
        // This would integrate with an AI service to classify nudity
        classifyImage(request.imageUrl)
            .then(result => {
                sendResponse({ success: true, result });
            })
            .catch(error => {
                sendResponse({ success: false, error: error.message });
            });
        
        return true; // Keep message channel open for async response
    }
    
    if (request.action === 'getSettings') {
        chrome.storage.sync.get(['enabled', 'nudityThreshold', 'hideImagesOnLoad'], (result) => {
            sendResponse(result);
        });
        return true;
    }
});

// Placeholder function for image classification
async function classifyImage(imageUrl) {
    // This would call an external AI service
    // For now, return a mock result
    console.log('Classifying image:', imageUrl);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                nudityLevel: Math.random(),
                isProblematic: Math.random() > 0.7
            });
        }, 500);
    });
}