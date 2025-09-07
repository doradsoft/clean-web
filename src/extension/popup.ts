/**
 * Chrome Extension Popup Script
 * Manages the popup interface for the Clean Web extension
 */

class CleanWebPopup {
  private hiddenCountElement: HTMLElement;
  private statusElement: HTMLElement;
  private debugRestoreButton: HTMLElement;
  private refreshCountButton: HTMLElement;

  constructor() {
    this.hiddenCountElement = document.getElementById('hiddenCount')!;
    this.statusElement = document.getElementById('status')!;
    this.debugRestoreButton = document.getElementById('debugRestore')!;
    this.refreshCountButton = document.getElementById('refreshCount')!;
    
    this.init();
  }

  private init(): void {
    // Update display immediately
    this.updateDisplay();
    
    // Set up event listeners
    this.debugRestoreButton.addEventListener('click', () => this.debugRestore());
    this.refreshCountButton.addEventListener('click', () => this.updateDisplay());
    
    // Auto-refresh every 2 seconds
    setInterval(() => this.updateDisplay(), 2000);
  }

  private async updateDisplay(): Promise<void> {
    try {
      // Get stats from storage (updated by content script)
      const result = await chrome.storage.local.get(['hiddenCount']);
      const hiddenCount = result.hiddenCount || 0;
      
      // Update display
      this.hiddenCountElement.textContent = hiddenCount.toString();
      this.statusElement.textContent = hiddenCount > 0 ? 'Active' : 'No images found';
      
      // Update button color based on status
      if (hiddenCount > 0) {
        this.statusElement.style.color = '#28a745';
      } else {
        this.statusElement.style.color = '#6c757d';
      }
    } catch (error) {
      console.error('[Clean Web Popup] Failed to update display:', error);
      this.hiddenCountElement.textContent = 'Error';
      this.statusElement.textContent = 'Error';
    }
  }

  private async debugRestore(): Promise<void> {
    try {
      // Get the active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];
      
      if (!activeTab.id) {
        console.error('[Clean Web Popup] No active tab found');
        return;
      }
      
      // Execute script to restore all images for debugging
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: () => {
          // Access the global cleanWebExtension instance
          if ((window as any).cleanWebExtension) {
            (window as any).cleanWebExtension.restoreAllImages();
          }
        }
      });
      
      // Update display
      setTimeout(() => this.updateDisplay(), 500);
      
    } catch (error) {
      console.error('[Clean Web Popup] Failed to restore images:', error);
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CleanWebPopup();
});