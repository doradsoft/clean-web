import { ImageElement } from '@/types';

/**
 * Business logic for detecting and managing image elements in the DOM
 * Responsible for finding all image elements that need to be processed
 * Enhanced with comprehensive mutation observer capabilities
 */
export class ImageDetector {
  private observer: MutationObserver | null = null;
  private detectedElements: Set<HTMLElement> = new Set();
  private stats = {
    totalImages: 0,
    backgroundImages: 0,
    imgElements: 0
  };

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
      // Extract URL from css url() function
      const matches = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (matches && matches[1]) {
        return matches[1];
      }
    }
    return null;
  }

  /**
   * Process a single element for image detection
   */
  private processElement(element: HTMLElement): ImageElement[] {
    const images: ImageElement[] = [];
    
    // Check if element is an IMG
    if (element.tagName === 'IMG') {
      const img = element as HTMLImageElement;
      const imageUrl = this.extractImageSrc(img);
      if (imageUrl && !this.detectedElements.has(element)) {
        images.push({
          element: element,
          src: imageUrl,
          type: 'img'
        });
        this.detectedElements.add(element);
        this.stats.imgElements++;
        this.stats.totalImages++;
      }
    }

    // Check for background images on any element
    const bgImageUrl = this.extractBackgroundImage(element);
    if (bgImageUrl && !this.detectedElements.has(element)) {
      images.push({
        element: element,
        src: bgImageUrl,
        type: 'background'
      });
      this.detectedElements.add(element);
      this.stats.backgroundImages++;
      this.stats.totalImages++;
    }

    return images;
  }

  /**
   * Finds all image elements currently in the DOM
   */
  detectImages(): ImageElement[] {
    const images: ImageElement[] = [];
    
    // Find img elements
    const imgElements = document.querySelectorAll('img');
    imgElements.forEach(img => {
      const imageUrl = this.extractImageSrc(img);
      if (imageUrl) {
        images.push({
          element: img,
          src: imageUrl,
          type: 'img'
        });
        this.detectedElements.add(img);
        this.stats.imgElements++;
      }
    });

    // Find elements with background images
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      const bgImageUrl = this.extractBackgroundImage(htmlElement);
      if (bgImageUrl && !this.detectedElements.has(htmlElement)) {
        images.push({
          element: htmlElement,
          src: bgImageUrl,
          type: 'background'
        });
        this.detectedElements.add(htmlElement);
        this.stats.backgroundImages++;
      }
    });

    // Find video elements with poster images
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(video => {
      const videoElement = video as HTMLVideoElement;
      if (videoElement.poster) {
        images.push({
          element: videoElement,
          src: videoElement.poster,
          type: 'video'
        });
        this.detectedElements.add(videoElement);
      }
    });

    this.stats.totalImages = images.length;
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
      const newImages: ImageElement[] = [];

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Handle added nodes
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              
              // Process the element itself
              const elementImages = this.processElement(element);
              newImages.push(...elementImages);

              // Process child elements
              const childImages = element.querySelectorAll('img, *');
              childImages.forEach(childElement => {
                const childImages = this.processElement(childElement as HTMLElement);
                newImages.push(...childImages);
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
              mutation.attributeName === 'class') {
            
            const elementImages = this.processElement(element);
            newImages.push(...elementImages);
          }
        }
      });

      if (newImages.length > 0) {
        console.log(`ImageDetector: Found ${newImages.length} new images`);
        onNewImages(newImages);
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'data-src', 'data-lazy-src', 'style', 'class']
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
    this.stats = {
      totalImages: 0,
      backgroundImages: 0,
      imgElements: 0
    };
  }

  /**
   * Get detection statistics
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Add visual indicator to detected images (for debugging)
   */
  addVisualIndicators(): void {
    this.detectedElements.forEach(element => {
      element.style.border = '2px solid red';
      element.style.boxSizing = 'border-box';
    });
  }
}