import { ImageElement } from '@/types';

/**
 * Business logic for detecting and managing image elements in the DOM
 * Responsible for finding all image elements that need to be processed
 */
export class ImageDetector {
  private observer: MutationObserver | null = null;
  private detectedElements: Set<HTMLElement> = new Set();

  /**
   * Extract src from img elements, including lazy loading attributes
   */
  private extractImageSrc(img: HTMLImageElement): string | null {
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
  private extractBackgroundImage(element: HTMLElement): string | null {
    const computedStyle = window.getComputedStyle(element);
    const backgroundImage = computedStyle.backgroundImage;
    
    if (backgroundImage && backgroundImage !== 'none') {
      const urlMatch = backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
      if (urlMatch && urlMatch[1]) {
        return urlMatch[1];
      }
    }
    return null;
  }

  /**
   * Finds all image elements currently in the DOM
   */
  detectImages(): ImageElement[] {
    const images: ImageElement[] = [];
    
    // Find img elements with lazy loading support
    const imgElements = document.querySelectorAll('img');
    imgElements.forEach(img => {
      const imageUrl = this.extractImageSrc(img);
      if (imageUrl) {
        images.push({
          element: img,
          src: imageUrl,
          type: 'img'
        });
      }
    });

    // Find elements with background images
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      const backgroundImageUrl = this.extractBackgroundImage(element as HTMLElement);
      if (backgroundImageUrl) {
        images.push({
          element: element as HTMLElement,
          src: backgroundImageUrl,
          type: 'background'
        });
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
   * Enhanced with comprehensive mutation detection
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
          // Handle added nodes
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              
              // Check if the added node itself is an image
              if (element.tagName === 'IMG') {
                const img = element as HTMLImageElement;
                const imageUrl = this.extractImageSrc(img);
                if (imageUrl && !this.detectedElements.has(img)) {
                  newImages.push({
                    element: img,
                    src: imageUrl,
                    type: 'img'
                  });
                  this.detectedElements.add(img);
                  hasNewImages = true;
                }
              }

              // Check for video poster
              if (element.tagName === 'VIDEO') {
                const video = element as HTMLVideoElement;
                if (video.poster && !this.detectedElements.has(video)) {
                  newImages.push({
                    element: video,
                    src: video.poster,
                    type: 'video'
                  });
                  this.detectedElements.add(video);
                  hasNewImages = true;
                }
              }

              // Check for background images
              const backgroundImageUrl = this.extractBackgroundImage(element);
              if (backgroundImageUrl && !this.detectedElements.has(element)) {
                newImages.push({
                  element: element,
                  src: backgroundImageUrl,
                  type: 'background'
                });
                this.detectedElements.add(element);
                hasNewImages = true;
              }

              // Check for images within the added node
              const childImages = element.querySelectorAll('img');
              childImages.forEach(img => {
                const imageUrl = this.extractImageSrc(img);
                if (imageUrl && !this.detectedElements.has(img)) {
                  newImages.push({
                    element: img,
                    src: imageUrl,
                    type: 'img'
                  });
                  this.detectedElements.add(img);
                  hasNewImages = true;
                }
              });

              // Check for video posters within the added node
              const childVideos = element.querySelectorAll('video');
              childVideos.forEach(video => {
                if (video.poster && !this.detectedElements.has(video)) {
                  newImages.push({
                    element: video,
                    src: video.poster,
                    type: 'video'
                  });
                  this.detectedElements.add(video);
                  hasNewImages = true;
                }
              });

              // Check for background images in child elements
              const allChildElements = element.querySelectorAll('*');
              allChildElements.forEach(childElement => {
                const childBgUrl = this.extractBackgroundImage(childElement as HTMLElement);
                if (childBgUrl && !this.detectedElements.has(childElement as HTMLElement)) {
                  newImages.push({
                    element: childElement as HTMLElement,
                    src: childBgUrl,
                    type: 'background'
                  });
                  this.detectedElements.add(childElement as HTMLElement);
                  hasNewImages = true;
                }
              });
            }
          });
        } else if (mutation.type === 'attributes') {
          // Handle attribute changes (src, style, etc.)
          const element = mutation.target as HTMLElement;
          if (mutation.attributeName === 'src' || 
              mutation.attributeName === 'data-src' ||
              mutation.attributeName === 'data-lazy-src' ||
              mutation.attributeName === 'style' ||
              mutation.attributeName === 'class' ||
              mutation.attributeName === 'poster') {
            
            // Re-check this element for images
            if (element.tagName === 'IMG') {
              const img = element as HTMLImageElement;
              const imageUrl = this.extractImageSrc(img);
              if (imageUrl && !this.detectedElements.has(img)) {
                newImages.push({
                  element: img,
                  src: imageUrl,
                  type: 'img'
                });
                this.detectedElements.add(img);
                hasNewImages = true;
              }
            }

            if (element.tagName === 'VIDEO') {
              const video = element as HTMLVideoElement;
              if (video.poster && !this.detectedElements.has(video)) {
                newImages.push({
                  element: video,
                  src: video.poster,
                  type: 'video'
                });
                this.detectedElements.add(video);
                hasNewImages = true;
              }
            }

            // Check for background image changes
            const backgroundImageUrl = this.extractBackgroundImage(element);
            if (backgroundImageUrl && !this.detectedElements.has(element)) {
              newImages.push({
                element: element,
                src: backgroundImageUrl,
                type: 'background'
              });
              this.detectedElements.add(element);
              hasNewImages = true;
            }
          }
        }
      });

      if (hasNewImages) {
        onNewImages(newImages);
      }
    });

    // Observe with comprehensive options
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'data-src', 'data-lazy-src', 'style', 'class', 'poster']
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