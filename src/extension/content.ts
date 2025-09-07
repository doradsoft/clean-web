/**
 * Chrome Extension Content Script
 * This script runs on all web pages and implements the "hide all before processing" functionality
 * using the separated business logic from the clean-web core
 */

import { CleanWebCore } from '@/business-logic';
import { FilterSettings } from '@/types';

class CleanWebExtension {
  private core: CleanWebCore;
  private hiddenCount = 0;

  constructor() {
    // Initialize with default settings for "hide all before processing" mode
    const settings: FilterSettings = {
      nudityThreshold: 0, // Hide everything initially
      strictMode: true,
      allowList: [],
      blockList: []
    };

    this.core = new CleanWebCore(settings);
    this.init();
  }

  private async init(): Promise<void> {
    try {
      // Start the core with immediate hiding functionality
      await this.core.startWithImmediateHiding();
      
      // Update hidden count
      this.updateHiddenCount();
      
      // Set up periodic count updates
      setInterval(() => this.updateHiddenCount(), 1000);
      
      console.log('[Clean Web] Extension initialized - all images hidden before processing');
    } catch (error) {
      console.error('[Clean Web] Failed to initialize:', error);
    }
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

// Initialize the extension when the script loads
const cleanWebExtension = new CleanWebExtension();

// Make debug functions available globally for testing
(window as any).cleanWebExtension = cleanWebExtension;