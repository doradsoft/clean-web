/**
 * Clean Web Extension - Popup Script
 * Provides interface for monitoring and controlling the image hiding functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    const statusElement = document.getElementById('status');
    const hiddenCountElement = document.getElementById('hiddenCount');
    const refreshButton = document.getElementById('refreshCount');
    const restoreButton = document.getElementById('restoreAll');
    
    /**
     * Execute script in the active tab
     */
    function executeScript(func, callback) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                func: func
            }, callback);
        });
    }
    
    /**
     * Update the hidden count display
     */
    function updateHiddenCount() {
        executeScript(
            function() {
                return window.cleanWebGetHiddenCount ? window.cleanWebGetHiddenCount() : 'Extension not loaded';
            },
            function(results) {
                if (results && results[0]) {
                    const count = results[0].result;
                    hiddenCountElement.textContent = count;
                    
                    if (typeof count === 'number') {
                        statusElement.textContent = count > 0 ? 
                            `Active - ${count} images hidden` : 
                            'Active - No images found';
                    } else {
                        statusElement.textContent = 'Extension loading...';
                        hiddenCountElement.textContent = 'Loading...';
                    }
                } else {
                    hiddenCountElement.textContent = 'Error';
                    statusElement.textContent = 'Extension not active';
                }
            }
        );
    }
    
    /**
     * Restore all hidden images (for debugging)
     */
    function restoreAllImages() {
        executeScript(
            function() {
                if (window.cleanWebRestoreAll) {
                    window.cleanWebRestoreAll();
                    return 'All images restored';
                } else {
                    return 'Extension not loaded';
                }
            },
            function(results) {
                if (results && results[0]) {
                    console.log('Clean Web:', results[0].result);
                    // Update count after restoration
                    setTimeout(updateHiddenCount, 100);
                }
            }
        );
    }
    
    // Event listeners
    refreshButton.addEventListener('click', updateHiddenCount);
    restoreButton.addEventListener('click', restoreAllImages);
    
    // Initial update
    updateHiddenCount();
    
    // Auto-refresh every 2 seconds
    setInterval(updateHiddenCount, 2000);
});