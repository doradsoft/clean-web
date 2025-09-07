import { CleanWebCore } from '@/business-logic';

/**
 * Content script for the Clean Web Chrome extension
 * Runs on web pages to detect and filter inappropriate images
 */
class ContentScript {
  private cleanWeb: CleanWebCore | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      // Load settings from Chrome storage
      const settings = await this.loadSettings();
      
      // Initialize Clean Web core with settings
      this.cleanWeb = new CleanWebCore(settings);
      
      // Start processing images on the page
      await this.cleanWeb.processPage();
      
      console.log('Clean Web extension initialized');
    } catch (error) {
      console.error('Failed to initialize Clean Web extension:', error);
    }
  }

  private async loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get({
        nudityThreshold: 5,
        strictMode: false,
        allowList: [],
        blockList: []
      }, resolve);
    });
  }
}

// Initialize content script when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ContentScript());
} else {
  new ContentScript();
}