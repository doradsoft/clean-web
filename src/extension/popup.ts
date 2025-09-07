/**
 * Clean Web Popup Script
 * Displays image detection statistics
 */

interface Stats {
  totalImages: number;
  backgroundImages: number;
  imgElements: number;
}

class CleanWebPopup {
  private stats: Stats;

  constructor() {
    this.stats = {
      totalImages: 0,
      backgroundImages: 0,
      imgElements: 0
    };
    this.initialize();
  }

  async initialize() {
    await this.loadStats();
    this.render();
    this.setupEventListeners();
    
    // Refresh stats every second
    setInterval(() => {
      this.loadStats().then(() => this.render());
    }, 1000);
  }

  async loadStats() {
    try {
      // Try to get stats from background script
      const response = await chrome.runtime.sendMessage({ type: 'GET_STATS' });
      if (response) {
        this.stats = response;
        return;
      }
    } catch (error) {
      console.log('Could not get stats from background script');
    }

    // Fallback: try to get stats from content script
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const win = window as any;
            if (win.cleanWebExtension) {
              return win.cleanWebExtension.getStats();
            }
            return null;
          }
        });
        
        if (results?.[0]?.result) {
          this.stats = results[0].result;
        }
      }
    } catch (error) {
      console.log('Could not get stats from content script:', error);
    }
  }

  render() {
    const content = document.getElementById('content');
    if (!content) return;

    content.innerHTML = `
      <div class="stats-container">
        <div class="stats-title">Detection Stats</div>
        <div class="stat-item">
          <span>Total Images:</span>
          <span class="stat-value">${this.stats.totalImages}</span>
        </div>
        <div class="stat-item">
          <span>IMG Elements:</span>
          <span class="stat-value">${this.stats.imgElements}</span>
        </div>
        <div class="stat-item">
          <span>Background Images:</span>
          <span class="stat-value">${this.stats.backgroundImages}</span>
        </div>
      </div>
      <button id="refresh-btn" class="refresh-btn">Refresh</button>
    `;
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target && target.id === 'refresh-btn') {
        this.loadStats().then(() => this.render());
      }
    });
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CleanWebPopup();
});