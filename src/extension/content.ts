/**
 * Chrome Extension Content Script
 * This script runs on all web pages and implements the "hide all before processing" functionality
 * using the separated business logic from the clean-web core with real TensorFlow.js integration
 */

import { CleanWebCore } from '@/business-logic';
import { FilterSettings } from '@/types';

class CleanWebExtension {
  private core: CleanWebCore;
  private hiddenCount = 0;
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
      await this.loadSettings();
      
      // Update core with loaded settings
      this.core = new CleanWebCore(this.settings);
      
      // Start the core with immediate hiding functionality for "hide all before processing"
      await this.core.startWithImmediateHiding();
      
      // Update hidden count
      this.updateHiddenCount();
      
      // Set up periodic count updates
      setInterval(() => this.updateHiddenCount(), 1000);
      
      console.log('[Clean Web] Extension initialized - all images hidden before processing with real AI');
    } catch (error) {
      console.error('[Clean Web] Failed to initialize:', error);
      
      // Fallback: try basic processing if immediate hiding fails
      try {
        await this.core.processPage();
        console.log('[Clean Web] Fallback mode: processing page without immediate hiding');
      } catch (fallbackError) {
        console.error('[Clean Web] Fallback also failed:', fallbackError);
      }
    }
  }

  private async loadSettings(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get({
          nudityThreshold: 5,
          strictMode: false,
          allowList: [],
          blockList: []
        }, (result) => {
          this.settings = result as FilterSettings;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  private updateHiddenCount(): void {
    const stats = this.core.getStats();
    this.hiddenCount = stats.hiddenCount;
    
    // Store count for popup access
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ hiddenCount: this.hiddenCount });
    }
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
    return {
      ...this.core.getStats(),
      hiddenCount: this.hiddenCount
    };
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
