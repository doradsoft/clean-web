import { ImageElement, FilterSettings, ImageAnalysis } from '@/types';

/**
 * Business logic for filtering and blocking/allowing images
 * Manages the actual hiding/showing of image elements
 */
export class ImageFilter {
  private settings: FilterSettings;
  private hiddenElements: Map<HTMLElement, string> = new Map();

  constructor(settings: FilterSettings) {
    this.settings = settings;
  }

  /**
   * Applies filter to an image element based on analysis results
   */
  applyFilter(imageElement: ImageElement, analysis: ImageAnalysis): void {
    if (this.shouldBlock(imageElement, analysis)) {
      this.hideImage(imageElement);
    } else {
      this.showImage(imageElement);
    }
  }

  /**
   * Determines if an image should be blocked
   */
  private shouldBlock(imageElement: ImageElement, analysis: ImageAnalysis): boolean {
    // Check allow list first
    if (this.isInAllowList(imageElement.src)) {
      return false;
    }

    // Check block list
    if (this.isInBlockList(imageElement.src)) {
      return true;
    }

    // Apply analysis-based filtering
    return analysis.isProblematic;
  }

  /**
   * Checks if URL is in allow list
   */
  private isInAllowList(src: string): boolean {
    return this.settings.allowList.some(pattern => {
      try {
        return new RegExp(pattern, 'i').test(src);
      } catch {
        return src.includes(pattern);
      }
    });
  }

  /**
   * Checks if URL is in block list
   */
  private isInBlockList(src: string): boolean {
    return this.settings.blockList.some(pattern => {
      try {
        return new RegExp(pattern, 'i').test(src);
      } catch {
        return src.includes(pattern);
      }
    });
  }

  /**
   * Hides an image element
   */
  private hideImage(imageElement: ImageElement): void {
    const { element } = imageElement;
    
    if (!this.hiddenElements.has(element)) {
      // Store original display value
      const originalDisplay = element.style.display;
      this.hiddenElements.set(element, originalDisplay);
      
      // Hide the element
      element.style.display = 'none';
      
      // Add a class for styling if needed
      element.classList.add('clean-web-hidden');
      
      // For background images, we might want to remove the background-image property
      if (imageElement.type === 'background') {
        element.style.backgroundImage = 'none';
      }
    }
  }

  /**
   * Shows a previously hidden image element
   */
  private showImage(imageElement: ImageElement): void {
    const { element } = imageElement;
    
    if (this.hiddenElements.has(element)) {
      // Restore original display value
      const originalDisplay = this.hiddenElements.get(element) || '';
      element.style.display = originalDisplay;
      
      // Remove the hidden class
      element.classList.remove('clean-web-hidden');
      
      // For background images, restore the original background
      if (imageElement.type === 'background') {
        // Note: In a real implementation, we'd need to store the original background-image
        // For now, we'll just remove the override
        element.style.backgroundImage = '';
      }
      
      this.hiddenElements.delete(element);
    }
  }

  /**
   * Updates filter settings
   */
  updateSettings(newSettings: Partial<FilterSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * Gets current filter settings
   */
  getSettings(): FilterSettings {
    return { ...this.settings };
  }

  /**
   * Clears all hidden elements and shows them
   */
  clearAll(): void {
    this.hiddenElements.forEach((originalDisplay, element) => {
      element.style.display = originalDisplay;
      element.classList.remove('clean-web-hidden');
    });
    this.hiddenElements.clear();
  }

  /**
   * Gets statistics about filtered images
   */
  getStats(): { hiddenCount: number; totalProcessed: number } {
    return {
      hiddenCount: this.hiddenElements.size,
      totalProcessed: this.hiddenElements.size // This would be more comprehensive in a real implementation
    };
  }

  /**
   * Immediately hides all images (for "hide all before processing" functionality)
   */
  hideAllImages(): void {
    const images = document.querySelectorAll('img');
    const videos = document.querySelectorAll('video');
    
    // Hide all img elements
    images.forEach(img => {
      if (!this.hiddenElements.has(img)) {
        const originalDisplay = img.style.display;
        this.hiddenElements.set(img, originalDisplay);
        img.style.display = 'none !important';
        img.classList.add('clean-web-hidden');
      }
    });
    
    // Hide all video elements
    videos.forEach(video => {
      if (!this.hiddenElements.has(video)) {
        const originalDisplay = video.style.display;
        this.hiddenElements.set(video, originalDisplay);
        video.style.display = 'none !important';
        video.classList.add('clean-web-hidden');
      }
    });
    
    // Hide elements with background images
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const backgroundImage = computedStyle.backgroundImage;
      
      if (backgroundImage && backgroundImage !== 'none') {
        const htmlElement = element as HTMLElement;
        if (!this.hiddenElements.has(htmlElement)) {
          const originalDisplay = htmlElement.style.display;
          this.hiddenElements.set(htmlElement, originalDisplay);
          htmlElement.style.display = 'none !important';
          htmlElement.classList.add('clean-web-hidden');
        }
      }
    });
  }
}