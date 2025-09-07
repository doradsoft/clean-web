/**
 * Chrome Extension Content Script
 * This script implements the "hide all before processing" functionality with comprehensive detection
 * using the separated business logic from the clean-web core with real TensorFlow.js integration
 */

import { CleanWebCore } from '@/business-logic';
import { FilterSettings } from '@/types';

class CleanWebExtension {
  private core: CleanWebCore;
  private settings: FilterSettings;

  constructor() {
    // Initialize with default settings
    this.settings = {
      nudityThreshold: 5, // Default threshold
      strictMode: false,
      allowList: [],
      blockList: []
    };

    this.core = new CleanWebCore(this.settings);
    this.init();
  }

  private async init(): Promise<void> {
    try {
      // Load settings from Chrome storage
      this.settings = await this.loadSettings();
      
      // Initialize Clean Web core with settings
      this.core = new CleanWebCore(this.settings);
      
      // Start the core with immediate hiding functionality for "hide all before processing"
      await this.core.startWithImmediateHiding();
      
      console.log('[Clean Web] Extension initialized - all images hidden before processing with real AI');
      
      // Send initial stats to background
      this.sendStatsUpdate();
      
      // Set up periodic stats updates
      setInterval(() => {
        this.sendStatsUpdate();
      }, 1000);
      
      // Listen for stats requests from popup
      chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
        if (message.type === 'REQUEST_STATS') {
          const stats = this.core.getStats();
          sendResponse(stats);
        }
      });
      
    } catch (error) {
      console.error('[Clean Web] Failed to initialize:', error);
      
      // Fallback: try basic processing if immediate hiding fails
      try {
        await this.core.start();
        console.log('[Clean Web] Fallback mode: started basic processing');
      } catch (fallbackError) {
        console.error('[Clean Web] Fallback also failed:', fallbackError);
      }
    }
  }

  private async loadSettings(): Promise<FilterSettings> {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get({
          nudityThreshold: 5,
          strictMode: false,
          allowList: [],
          blockList: []
        }, (result) => {
          resolve(result as FilterSettings);
        });
      } else {
        resolve({
          nudityThreshold: 5,
          strictMode: false,
          allowList: [],
          blockList: []
        });
      }
    });
  }
  
  private sendStatsUpdate() {
    const stats = this.core.getStats();
    chrome.runtime.sendMessage({
      type: 'STATS_UPDATE',
      data: stats
    }).catch(error => {
      // Ignore errors if background script isn't ready
      console.debug('Could not send stats update:', error);
    });
  }

  /**
   * Debug function to restore all hidden images (for testing)
   */
  public restoreAllImages(): void {
    this.core.stop();
    console.log('[Clean Web] All images restored for debugging');
  }

  /**
   * Get current statistics
   */
  public getStats() {
    return this.core.getStats();
  }
}

// Initialize the extension when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const cleanWebExtension = new CleanWebExtension();
    // Make debug functions available globally for testing
    (window as any).cleanWebExtension = cleanWebExtension;
  });
} else {
  const cleanWebExtension = new CleanWebExtension();
  // Make debug functions available globally for testing
  (window as any).cleanWebExtension = cleanWebExtension;
}
