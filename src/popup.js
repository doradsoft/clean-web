// Clean Web Popup Script
document.addEventListener('DOMContentLoaded', () => {
    const enabledCheckbox = document.getElementById('enabled');
    const hideImagesCheckbox = document.getElementById('hideImagesOnLoad');
    const nudityThresholdSlider = document.getElementById('nudityThreshold');
    const thresholdValueSpan = document.getElementById('thresholdValue');
    
    // Load current settings
    chrome.storage.sync.get(['enabled', 'nudityThreshold', 'hideImagesOnLoad'], (result) => {
        enabledCheckbox.checked = result.enabled !== false;
        hideImagesCheckbox.checked = result.hideImagesOnLoad !== false;
        nudityThresholdSlider.value = result.nudityThreshold || 0.3;
        thresholdValueSpan.textContent = nudityThresholdSlider.value;
    });
    
    // Update threshold display
    nudityThresholdSlider.addEventListener('input', () => {
        thresholdValueSpan.textContent = nudityThresholdSlider.value;
    });
    
    // Save settings when changed
    function saveSettings() {
        chrome.storage.sync.set({
            enabled: enabledCheckbox.checked,
            hideImagesOnLoad: hideImagesCheckbox.checked,
            nudityThreshold: parseFloat(nudityThresholdSlider.value)
        });
    }
    
    enabledCheckbox.addEventListener('change', saveSettings);
    hideImagesCheckbox.addEventListener('change', saveSettings);
    nudityThresholdSlider.addEventListener('change', saveSettings);
});