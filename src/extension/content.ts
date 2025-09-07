/**
 * Clean Web Content Script
 * Implements comprehensive image detection using the business logic
 */

import { CleanWebCore } from '@/business-logic';
import { FilterSettings } from '@/types';

// Extend window interface for popup communication
declare global {
  interface Window {
    cleanWebExtension: CleanWebExtension;
  }
}

// Default filter settings for the extension
const defaultSettings: FilterSettings = {
  nudityThreshold: 5,
  strictMode: false,
  allowList: [],
  blockList: []
};

class CleanWebExtension {
  private core: CleanWebCore;
  private stats = {
    totalImages: 0,
    backgroundImages: 0,
    imgElements: 0
  };

  constructor() {
    this.core = new CleanWebCore(defaultSettings);
    this.initialize();
  }

  private async initialize(): Promise<void> {
    console.log('Clean Web Extension: Initializing...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  private async start(): Promise<void> {
    try {
      await this.core.start();
      
      // Add visual indicators for debugging (can be toggled)
      this.core.addVisualIndicators();
      
      // Update stats periodically
      this.updateStats();
      setInterval(() => this.updateStats(), 1000);
      
      console.log('Clean Web Extension: Started successfully');
    } catch (error) {
      console.error('Clean Web Extension: Failed to start', error);
    }
  }

  private updateStats(): void {
    const coreStats = this.core.getStats();
    this.stats = {
      totalImages: coreStats.totalImages || 0,
      backgroundImages: coreStats.backgroundImages || 0,
      imgElements: coreStats.imgElements || 0
    };

    // Send stats to background script for popup
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({
        type: 'STATS_UPDATE',
        stats: this.stats
      }).catch(() => {
        // Ignore errors if no listener
      });
    }

    console.log('Clean Web Stats:', this.stats);
  }

  public getStats() {
    return { ...this.stats };
  }
}

// Initialize the extension
const cleanWebExtension = new CleanWebExtension();

// Make stats available globally for popup communication
(window as any).cleanWebExtension = cleanWebExtension;