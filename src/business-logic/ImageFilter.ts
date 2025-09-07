import { ImageAnalysis, ImageElement, FilterSettings } from '@/types';

/**
 * Business logic for filtering and blocking image elements
 * Applies blocking/filtering actions based on image analysis results
 */
export class ImageFilter {
  private settings: FilterSettings;
  private filteredElements: Set<HTMLElement> = new Set();
  private stats = {
    totalProcessed: 0,
    totalBlocked: 0,
    totalAllowed: 0
  };

  constructor(settings: FilterSettings) {
    this.settings = { ...settings };
  }

  /**
   * Apply filter to an image element based on analysis
   */
  applyFilter(imageElement: ImageElement, analysis: ImageAnalysis): void {
    this.stats.totalProcessed++;

    // Check allow/block lists first
    if (this.isInAllowList(imageElement.src)) {
      this.allowImage(imageElement);
      return;
    }

    if (this.isInBlockList(imageElement.src)) {
      this.blockImage(imageElement);
      return;
    }

    // Apply analysis-based filtering
    if (analysis.isProblematic || analysis.nudityLevel > this.settings.nudityThreshold) {
      this.blockImage(imageElement);
    } else {
      this.allowImage(imageElement);
    }
  }

  /**
   * Block an image element
   */
  private blockImage(imageElement: ImageElement): void {
    const element = imageElement.element;
    
    if (this.filteredElements.has(element)) {
      return; // Already processed
    }

    this.filteredElements.add(element);
    this.stats.totalBlocked++;

    // Apply blocking based on image type
    switch (imageElement.type) {
      case 'img':
        this.blockImgElement(element as HTMLImageElement);
        break;
      case 'background':
        this.blockBackgroundImage(element);
        break;
      case 'video':
        this.blockVideoElement(element as HTMLVideoElement);
        break;
    }

    console.log(`ImageFilter: Blocked ${imageElement.type} image: ${imageElement.src}`);
  }

  /**
   * Allow an image element (remove any previous blocking)
   */
  private allowImage(_imageElement: ImageElement): void {
    this.stats.totalAllowed++;
    // For now, we don't need to do anything special for allowed images
    // In the future, this could remove blocking if settings change
  }

  /**
   * Block IMG element
   */
  private blockImgElement(img: HTMLImageElement): void {
    img.style.display = 'none';
    
    // Optionally replace with placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'clean-web-blocked-image';
    placeholder.textContent = '🚫 Image blocked by Clean Web';
    placeholder.style.cssText = `
      display: inline-block;
      background: #f0f0f0;
      border: 2px dashed #ccc;
      padding: 20px;
      text-align: center;
      color: #666;
      font-family: Arial, sans-serif;
      font-size: 14px;
    `;
    
    img.parentNode?.insertBefore(placeholder, img);
  }

  /**
   * Block background image
   */
  private blockBackgroundImage(element: HTMLElement): void {
    element.style.backgroundImage = 'none';
    element.style.backgroundColor = '#f0f0f0';
    
    // Add blocked indicator if element is large enough
    const rect = element.getBoundingClientRect();
    if (rect.width > 50 && rect.height > 50) {
      const indicator = document.createElement('div');
      indicator.textContent = '🚫';
      indicator.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        z-index: 1000;
      `;
      
      // Make sure parent is positioned
      if (getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
      }
      
      element.appendChild(indicator);
    }
  }

  /**
   * Block video poster
   */
  private blockVideoElement(video: HTMLVideoElement): void {
    video.poster = '';
  }

  /**
   * Check if URL is in allow list
   */
  private isInAllowList(url: string): boolean {
    return this.settings.allowList.some(pattern => url.includes(pattern));
  }

  /**
   * Check if URL is in block list
   */
  private isInBlockList(url: string): boolean {
    return this.settings.blockList.some(pattern => url.includes(pattern));
  }

  /**
   * Update filter settings
   */
  updateSettings(newSettings: Partial<FilterSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * Get current settings
   */
  getSettings(): FilterSettings {
    return { ...this.settings };
  }

  /**
   * Get filtering statistics
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Clear all applied filters
   */
  clearAll(): void {
    this.filteredElements.forEach(element => {
      // Remove any applied styling
      const img = element as HTMLImageElement;
      if (img.tagName === 'IMG') {
        img.style.display = '';
      } else {
        element.style.backgroundImage = '';
        element.style.backgroundColor = '';
      }
      
      // Remove placeholders
      const placeholders = element.parentNode?.querySelectorAll('.clean-web-blocked-image');
      placeholders?.forEach(p => p.remove());
    });

    this.filteredElements.clear();
    this.stats = {
      totalProcessed: 0,
      totalBlocked: 0,
      totalAllowed: 0
    };
  }
}