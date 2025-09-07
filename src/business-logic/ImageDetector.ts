import { ImageElement } from '@/types';

/**
 * Business logic for detecting and managing image elements in the DOM
 * Responsible for finding all image elements that need to be processed
 */
export class ImageDetector {
  private observer: MutationObserver | null = null;
  private detectedElements: Set<HTMLElement> = new Set();

  /**
   * Finds all image elements currently in the DOM
   */
  detectImages(): ImageElement[] {
    const images: ImageElement[] = [];
    
    // Find img elements
    const imgElements = document.querySelectorAll('img');
    imgElements.forEach(img => {
      if (img.src) {
        images.push({
          element: img,
          src: img.src,
          type: 'img'
        });
      }
    });

    // Find elements with background images
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const backgroundImage = computedStyle.backgroundImage;
      
      if (backgroundImage && backgroundImage !== 'none') {
        const urlMatch = backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
        if (urlMatch && urlMatch[1]) {
          images.push({
            element: element as HTMLElement,
            src: urlMatch[1],
            type: 'background'
          });
        }
      }
    });

    // Find video elements
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(video => {
      if (video.poster) {
        images.push({
          element: video,
          src: video.poster,
          type: 'video'
        });
      }
    });

    return images;
  }

  /**
   * Starts observing for new image elements added to the DOM
   */
  startObserving(onNewImages: (images: ImageElement[]) => void): void {
    if (this.observer) {
      this.stopObserving();
    }

    this.observer = new MutationObserver((mutations) => {
      let hasNewImages = false;
      const newImages: ImageElement[] = [];

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              
              // Check if the added node itself is an image
              if (element.tagName === 'IMG') {
                const img = element as HTMLImageElement;
                if (img.src && !this.detectedElements.has(img)) {
                  newImages.push({
                    element: img,
                    src: img.src,
                    type: 'img'
                  });
                  this.detectedElements.add(img);
                  hasNewImages = true;
                }
              }

              // Check for images within the added node
              const childImages = element.querySelectorAll('img');
              childImages.forEach(img => {
                if (img.src && !this.detectedElements.has(img)) {
                  newImages.push({
                    element: img,
                    src: img.src,
                    type: 'img'
                  });
                  this.detectedElements.add(img);
                  hasNewImages = true;
                }
              });
            }
          });
        }
      });

      if (hasNewImages) {
        onNewImages(newImages);
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Stops observing for new image elements
   */
  stopObserving(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * Clears the detected elements cache
   */
  clearCache(): void {
    this.detectedElements.clear();
  }
}