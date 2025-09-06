/**
 * Clean Web Extension - Content Script
 * Hides all image elements before processing for content classification
 */

(function() {
    'use strict';
    
    console.log('Clean Web: Starting image hiding process...');
    
    // Configuration
    const HIDDEN_CLASS = 'clean-web-hidden';
    const CONTAINER_CLASS = 'clean-web-image-container';
    const PLACEHOLDER_CLASS = 'clean-web-placeholder';
    
    // Track hidden elements for potential restoration
    const hiddenElements = new Set();
    
    /**
     * Hide all image elements immediately
     */
    function hideAllImages() {
        console.log('Clean Web: Hiding all images before processing...');
        
        // Hide all img elements
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.classList.contains(HIDDEN_CLASS)) {
                img.classList.add(HIDDEN_CLASS);
                hiddenElements.add(img);
                console.log('Clean Web: Hidden img element:', img.src || img.getAttribute('src'));
            }
        });
        
        // Hide all video elements
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (!video.classList.contains(HIDDEN_CLASS)) {
                video.classList.add(HIDDEN_CLASS);
                hiddenElements.add(video);
                console.log('Clean Web: Hidden video element:', video.src || video.getAttribute('src'));
            }
        });
        
        // Hide elements with background images
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const backgroundImage = computedStyle.backgroundImage;
            
            if (backgroundImage && backgroundImage !== 'none' && !element.classList.contains(HIDDEN_CLASS)) {
                element.classList.add(HIDDEN_CLASS);
                hiddenElements.add(element);
                console.log('Clean Web: Hidden element with background image:', backgroundImage);
            }
        });
        
        console.log(`Clean Web: Hidden ${hiddenElements.size} image elements total`);
    }
    
    /**
     * Observer to hide newly added images
     */
    function setupMutationObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the added node is an image element
                        if (node.tagName === 'IMG' || node.tagName === 'VIDEO') {
                            if (!node.classList.contains(HIDDEN_CLASS)) {
                                node.classList.add(HIDDEN_CLASS);
                                hiddenElements.add(node);
                                console.log('Clean Web: Hidden dynamically added image/video:', node.tagName);
                            }
                        }
                        
                        // Check for nested images in added nodes
                        const nestedImages = node.querySelectorAll('img, video');
                        nestedImages.forEach(img => {
                            if (!img.classList.contains(HIDDEN_CLASS)) {
                                img.classList.add(HIDDEN_CLASS);
                                hiddenElements.add(img);
                                console.log('Clean Web: Hidden nested image/video:', img.tagName);
                            }
                        });
                        
                        // Check for background images on added elements
                        if (node.style && node.style.backgroundImage && node.style.backgroundImage !== 'none') {
                            if (!node.classList.contains(HIDDEN_CLASS)) {
                                node.classList.add(HIDDEN_CLASS);
                                hiddenElements.add(node);
                                console.log('Clean Web: Hidden element with background image');
                            }
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'src']
        });
        
        console.log('Clean Web: Mutation observer set up to catch new images');
        return observer;
    }
    
    /**
     * Initialize the hiding process
     */
    function initialize() {
        // Hide images immediately if DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', hideAllImages);
        } else {
            hideAllImages();
        }
        
        // Also hide images when window loads (catch any late-loading images)
        window.addEventListener('load', hideAllImages);
        
        // Set up observer for dynamic content
        if (document.body) {
            setupMutationObserver();
        } else {
            document.addEventListener('DOMContentLoaded', setupMutationObserver);
        }
        
        console.log('Clean Web: Content script initialized');
    }
    
    /**
     * Utility function to get hidden elements count (for debugging/testing)
     */
    window.cleanWebGetHiddenCount = function() {
        return hiddenElements.size;
    };
    
    /**
     * Utility function to restore all hidden images (for debugging/testing)
     */
    window.cleanWebRestoreAll = function() {
        hiddenElements.forEach(element => {
            element.classList.remove(HIDDEN_CLASS);
        });
        hiddenElements.clear();
        console.log('Clean Web: All images restored');
    };
    
    // Start the extension
    initialize();
    
})();