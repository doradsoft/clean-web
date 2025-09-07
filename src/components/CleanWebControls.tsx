import React, { useState, useEffect } from 'react';
import { CleanWebCore } from '@/business-logic';
import { FilterSettings } from '@/types';

interface CleanWebControlsProps {
  core: CleanWebCore;
}

export const CleanWebControls: React.FC<CleanWebControlsProps> = ({ core }) => {
  const [settings, setSettings] = useState<FilterSettings>(core.getSettings());
  const [stats, setStats] = useState(core.getStats());
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(core.getStats());
    }, 1000);

    return () => clearInterval(interval);
  }, [core]);

  const handleStart = async () => {
    await core.start();
    setIsRunning(true);
  };

  const handleStop = () => {
    core.stop();
    setIsRunning(false);
  };

  const handleSettingsChange = (newSettings: Partial<FilterSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    core.updateSettings(newSettings);
  };

  const handleRefresh = async () => {
    await core.refresh();
  };

  return (
    <div className="clean-web-controls">
      <h2>Clean Web Controls</h2>
      
      <div className="control-section">
        <h3>System Status</h3>
        <p>Status: {isRunning ? 'Running' : 'Stopped'}</p>
        <p>Hidden Images: {stats.hiddenCount}</p>
        <p>Total Processed: {stats.totalProcessed}</p>
        
        <div className="control-buttons">
          <button onClick={handleStart} disabled={isRunning}>
            Start
          </button>
          <button onClick={handleStop} disabled={!isRunning}>
            Stop
          </button>
          <button onClick={handleRefresh} disabled={!isRunning}>
            Refresh
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>Filter Settings</h3>
        
        <div className="setting-item">
          <label>
            Nudity Threshold (0-10):
            <input
              type="range"
              min="0"
              max="10"
              value={settings.nudityThreshold}
              onChange={(e) => handleSettingsChange({ nudityThreshold: parseInt(e.target.value) })}
            />
            <span>{settings.nudityThreshold}</span>
          </label>
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.strictMode}
              onChange={(e) => handleSettingsChange({ strictMode: e.target.checked })}
            />
            Strict Mode
          </label>
        </div>

        <div className="setting-item">
          <label>
            Allow List (comma separated):
            <textarea
              value={settings.allowList.join(', ')}
              onChange={(e) => handleSettingsChange({ 
                allowList: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
              })}
              placeholder="example.com, trusted-site.org"
            />
          </label>
        </div>

        <div className="setting-item">
          <label>
            Block List (comma separated):
            <textarea
              value={settings.blockList.join(', ')}
              onChange={(e) => handleSettingsChange({ 
                blockList: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
              })}
              placeholder="bad-site.com, suspicious-domain.net"
            />
          </label>
        </div>
      </div>
    </div>
  );
};