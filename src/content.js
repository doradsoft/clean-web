// Clean Web Content Script
(function() {
    'use strict';
    
    console.log('Clean Web extension loaded');
    
    // Configuration
    const config = {
        hideImagesOnLoad: true,
        nudityThreshold: 0.3
    };
    
    // Hide all images by default
    function hideAllImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.display = 'none';
            img.dataset.cleanWebHidden = 'true';
        });
        
        // Also handle background images
        const elementsWithBgImages = document.querySelectorAll('*');
        elementsWithBgImages.forEach(el => {
            const bgImage = window.getComputedStyle(el).backgroundImage;
            if (bgImage && bgImage !== 'none') {
                el.style.backgroundImage = 'none';
                el.dataset.cleanWebBgHidden = 'true';
                el.dataset.cleanWebOriginalBg = bgImage;
            }
        });
    }
    
    // Process images for classification (placeholder for now)
    function processImage(imageElement) {
        // This will be expanded to fetch and classify images
        console.log('Processing image:', imageElement.src);
        
        // For now, just show the image after a delay (demo purposes)
        setTimeout(() => {
            if (imageElement.dataset.cleanWebHidden === 'true') {
                imageElement.style.display = '';
                delete imageElement.dataset.cleanWebHidden;
            }
        }, 1000);
    }
    
    // Initialize when DOM is ready
    function initialize() {
        if (config.hideImagesOnLoad) {
            hideAllImages();
        }
        
        // Process existing images
        const images = document.querySelectorAll('img[src]');
        images.forEach(processImage);
        
        // Watch for new images being added
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'IMG' && node.src) {
                            if (config.hideImagesOnLoad) {
                                node.style.display = 'none';
                                node.dataset.cleanWebHidden = 'true';
                            }
                            processImage(node);
                        }
                        
                        // Check for images in added subtree
                        const imgs = node.querySelectorAll ? node.querySelectorAll('img[src]') : [];
                        imgs.forEach(img => {
                            if (config.hideImagesOnLoad) {
                                img.style.display = 'none';
                                img.dataset.cleanWebHidden = 'true';
                            }
                            processImage(img);
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true
        });
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();