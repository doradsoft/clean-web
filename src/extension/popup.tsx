import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface Settings {
  nudityThreshold: number;
  strictMode: boolean;
  allowList: string[];
  blockList: string[];
}

interface Stats {
  total: number;
  img: number;
  background: number;
  video: number;
}

const Popup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'settings' | 'stats'>('stats');
  const [settings, setSettings] = useState<Settings>({
    nudityThreshold: 5,
    strictMode: false,
    allowList: [],
    blockList: []
  });
  const [stats, setStats] = useState<Stats>({ total: 0, img: 0, background: 0, video: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load current settings
    chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (response) => {
      if (response) {
        setSettings(response);
      }
      setLoading(false);
    });
    
    // Load current stats
    updateStats();
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    chrome.runtime.sendMessage({
      type: 'UPDATE_SETTINGS',
      settings: updatedSettings
    }, (response) => {
      if (response?.success) {
        console.log('Settings updated successfully');
      }
    });
  };

  const updateStats = async () => {
    try {
      // Get the active tab and request stats from content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { type: 'REQUEST_STATS' }, (response) => {
          if (response) {
            setStats(response);
          }
        });
      }
    } catch (error) {
      console.error('Failed to get stats:', error);
    }
  };

  const reloadContentScripts = () => {
    chrome.runtime.sendMessage({ type: 'RELOAD_CONTENT_SCRIPTS' }, (response) => {
      if (response?.success) {
        window.close(); // Close popup after reload
      }
    });
  };

  if (loading) {
    return (
      <div className="popup">
        <div className="loading">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="popup">
      <header className="popup-header">
        <h1>Clean Web</h1>
        <p>Comprehensive Image Detection & Filtering</p>
      </header>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Detection Stats
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <main className="popup-content">
        {/* Stats Tab */}
        <div className={`tab-content ${activeTab === 'stats' ? 'active' : ''}`}>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Images</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.img}</div>
              <div className="stat-label">IMG Elements</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.background}</div>
              <div className="stat-label">Background Images</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.video}</div>
              <div className="stat-label">Video Posters</div>
            </div>
          </div>
          
          <div className="actions">
            <button onClick={updateStats} className="refresh-btn">
              Refresh Stats
            </button>
          </div>
        </div>

        {/* Settings Tab */}
        <div className={`tab-content ${activeTab === 'settings' ? 'active' : ''}`}>
          <div className="setting-group">
            <label htmlFor="threshold">
              Sensitivity Level: {settings.nudityThreshold}
            </label>
            <input
              id="threshold"
              type="range"
              min="0"
              max="10"
              value={settings.nudityThreshold}
              onChange={(e) => updateSettings({ nudityThreshold: parseInt(e.target.value) })}
            />
            <div className="threshold-labels">
              <span>Permissive (0)</span>
              <span>Strict (10)</span>
            </div>
          </div>

          <div className="setting-group">
            <label>
              <input
                type="checkbox"
                checked={settings.strictMode}
                onChange={(e) => updateSettings({ strictMode: e.target.checked })}
              />
              Enhanced filtering (Strict Mode)
            </label>
          </div>

          <div className="setting-group">
            <label htmlFor="allowList">Always Allow (domains):</label>
            <textarea
              id="allowList"
              value={settings.allowList.join('\n')}
              onChange={(e) => updateSettings({ 
                allowList: e.target.value.split('\n').filter(s => s.trim()) 
              })}
              placeholder="example.com&#10;trusted-site.org"
              rows={3}
            />
          </div>

          <div className="setting-group">
            <label htmlFor="blockList">Always Block (domains):</label>
            <textarea
              id="blockList"
              value={settings.blockList.join('\n')}
              onChange={(e) => updateSettings({ 
                blockList: e.target.value.split('\n').filter(s => s.trim()) 
              })}
              placeholder="blocked-site.com&#10;suspicious-domain.net"
              rows={3}
            />
          </div>

          <div className="actions">
            <button onClick={reloadContentScripts} className="reload-btn">
              Apply & Reload Pages
            </button>
          </div>
        </div>
      </main>

      <footer className="popup-footer">
        <small>Comprehensive Mutation Observer Detection</small>
      </footer>
    </div>
  );
};

// Initialize React app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}