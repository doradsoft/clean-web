/**
 * Clean Web Content Script
 * Implements mutation observer for image detection
 */

class ImageDetector {
  constructor() {
    this.observer = null;
    this.detectedImages = new Set();
    this.stats = {
      totalImages: 0,
      backgroundImages: 0,
      imgElements: 0
    };
  }

  /**
   * Extract src from img elements
   */
  extractImageSrc(img) {
    if (img.src) {
      return img.src;
    }
    if (img.dataset.src) {
      return img.dataset.src;
    }
    if (img.getAttribute('data-lazy-src')) {
      return img.getAttribute('data-lazy-src');
    }
    return null;
  }

  /**
   * Extract background-image from computed styles
   */
  extractBackgroundImage(element) {
    const computedStyle = window.getComputedStyle(element);
    const backgroundImage = computedStyle.backgroundImage;
    
    if (backgroundImage && backgroundImage !== 'none') {
      // Extract URL from css url() function
      const matches = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (matches && matches[1]) {
        return matches[1];
      }
    }
    return null;
  }

  /**
   * Process a single element for images
   */
  processElement(element) {
    let imageUrl = null;
    let imageType = null;

    // Check if it's an img element
    if (element.tagName === 'IMG') {
      imageUrl = this.extractImageSrc(element);
      imageType = 'img';
    }
    
    // Check for background-image on any element
    const bgImageUrl = this.extractBackgroundImage(element);
    if (bgImageUrl) {
      // If we already found an img src, we'll process the background image separately
      if (imageUrl) {
        this.handleDetectedImage(bgImageUrl, 'background-image', element);
      } else {
        imageUrl = bgImageUrl;
        imageType = 'background-image';
      }
    }

    if (imageUrl && !this.detectedImages.has(imageUrl)) {
      this.detectedImages.add(imageUrl);
      this.handleDetectedImage(imageUrl, imageType, element);
    }
  }

  /**
   * Handle detected image
   */
  handleDetectedImage(imageUrl, type, element) {
    console.log(`[Clean Web] Detected ${type}:`, imageUrl, element);
    
    // Update stats
    this.stats.totalImages++;
    if (type === 'background-image') {
      this.stats.backgroundImages++;
    } else if (type === 'img') {
      this.stats.imgElements++;
    }
    
    // TODO: This is where we would:
    // 1. Hide the image by default
    // 2. Fetch and classify the image
    // 3. Block/allow based on classification
    
    // For now, just log the detection and mark the element
    element.dataset.cleanWebDetected = 'true';
    element.dataset.cleanWebType = type;
    element.dataset.cleanWebUrl = imageUrl;
  }

  /**
   * Process existing images on the page
   */
  processExistingImages() {
    console.log('[Clean Web] Processing existing images...');
    
    // Process all img elements
    const imgElements = document.querySelectorAll('img');
    imgElements.forEach(img => this.processElement(img));
    
    // Process all elements for background images
    // Note: This could be expensive on large pages, so we limit to common containers
    const elementsWithPossibleBackgrounds = document.querySelectorAll(
      'div, section, header, article, aside, main, span, a, button, [style*="background"]'
    );
    elementsWithPossibleBackgrounds.forEach(element => {
      const bgUrl = this.extractBackgroundImage(element);
      if (bgUrl && !this.detectedImages.has(bgUrl)) {
        this.detectedImages.add(bgUrl);
        this.handleDetectedImage(bgUrl, 'background-image', element);
      }
    });
  }

  /**
   * Start the mutation observer
   */
  startObserver() {
    if (this.observer) {
      return;
    }

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Process added nodes
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Process the added element
            this.processElement(node);
            
            // Process child img elements
            if (node.querySelectorAll) {
              const childImages = node.querySelectorAll('img');
              childImages.forEach(img => this.processElement(img));
              
              // Process child elements with possible background images
              const childElementsWithBg = node.querySelectorAll(
                'div, section, header, article, aside, main, span, a, button, [style*="background"]'
              );
              childElementsWithBg.forEach(element => {
                const bgUrl = this.extractBackgroundImage(element);
                if (bgUrl && !this.detectedImages.has(bgUrl)) {
                  this.detectedImages.add(bgUrl);
                  this.handleDetectedImage(bgUrl, 'background-image', element);
                }
              });
            }
          }
        });

        // Process attribute changes (e.g., src changes)
        if (mutation.type === 'attributes') {
          const target = mutation.target;
          if (mutation.attributeName === 'src' || 
              mutation.attributeName === 'style' ||
              mutation.attributeName === 'data-src') {
            this.processElement(target);
          }
        }
      });
    });

    // Start observing
    this.observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'style', 'data-src', 'data-lazy-src']
    });

    console.log('[Clean Web] Mutation observer started');
  }

  /**
   * Stop the mutation observer
   */
  stopObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
      console.log('[Clean Web] Mutation observer stopped');
    }
  }

  /**
   * Get current stats
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Refresh stats by recounting detected images
   */
  refreshStats() {
    this.stats = {
      totalImages: 0,
      backgroundImages: 0,
      imgElements: 0
    };
    this.processExistingImages();
  }

  /**
   * Initialize the image detector
   */
  init() {
    console.log('[Clean Web] Initializing image detector...');
    
    // Process existing images when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.processExistingImages();
      });
    } else {
      this.processExistingImages();
    }

    // Start mutation observer
    this.startObserver();
  }
}

// Initialize the image detector
const imageDetector = new ImageDetector();
imageDetector.init();

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_STATS') {
    const stats = imageDetector.getStats();
    sendResponse(stats);
    return true;
  } else if (request.type === 'REFRESH_STATS') {
    imageDetector.refreshStats();
    const stats = imageDetector.getStats();
    sendResponse(stats);
    return true;
  }
});

// Make it available globally for debugging
window.cleanWebImageDetector = imageDetector;