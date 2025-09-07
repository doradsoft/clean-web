import { CleanWebCore } from '@/business-logic';
import { FilterSettings } from '@/types';

/**
 * Content script for the Clean Web Chrome extension
 * Runs on web pages to detect and filter inappropriate images
 * Includes comprehensive mutation observer for IMG, background-image, and video poster detection
 */
class ContentScript {
  private cleanWeb: CleanWebCore | null = null;
  private settings: FilterSettings | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      // Load settings from Chrome storage
      this.settings = await this.loadSettings();
      
      // Initialize Clean Web core with settings
      this.cleanWeb = new CleanWebCore(this.settings);
      
      // Start the comprehensive image detection system with mutation observer
      await this.cleanWeb.start();
      
      console.log('Clean Web extension initialized with comprehensive mutation observer');
      
      // Send initial stats to background
      this.sendStatsUpdate();
      
      // Set up periodic stats updates
      setInterval(() => {
        this.sendStatsUpdate();
      }, 5000);
      
      // Listen for stats requests from popup
      chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
        if (message.type === 'REQUEST_STATS') {
          const stats = this.cleanWeb?.getStats() || { total: 0, img: 0, background: 0, video: 0 };
          sendResponse(stats);
        }
      });
      
    } catch (error) {
      console.error('Failed to initialize Clean Web extension:', error);
    }
  }

  private async loadSettings(): Promise<FilterSettings> {
    return new Promise((resolve) => {
      chrome.storage.sync.get({
        nudityThreshold: 5,
        strictMode: false,
        allowList: [],
        blockList: []
      }, (result) => {
        resolve(result as FilterSettings);
      });
    });
  }
  
  private sendStatsUpdate() {
    if (this.cleanWeb) {
      const stats = this.cleanWeb.getStats();
      chrome.runtime.sendMessage({
        type: 'STATS_UPDATE',
        data: stats
      }).catch(error => {
        // Ignore errors if background script isn't ready
        console.debug('Could not send stats update:', error);
      });
    }
  }
}

// Initialize content script when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ContentScript());
} else {
  new ContentScript();
}
