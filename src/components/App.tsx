import { useState, useEffect } from 'react';
import { CleanWebCore } from '@/business-logic';
import { FilterSettings } from '@/types';

const defaultSettings: FilterSettings = {
  nudityThreshold: 5,
  strictMode: false,
  allowList: [],
  blockList: []
};

export function App() {
  const [core] = useState(() => new CleanWebCore(defaultSettings));
  const [stats, setStats] = useState({
    totalImages: 0,
    backgroundImages: 0,
    imgElements: 0,
    totalProcessed: 0,
    totalBlocked: 0,
    totalAllowed: 0,
    isRunning: false
  });

  useEffect(() => {
    core.start();
    
    const interval = setInterval(() => {
      const currentStats = core.getStats();
      setStats(currentStats);
    }, 1000);

    return () => {
      clearInterval(interval);
      core.stop();
    };
  }, [core]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Clean Web</h1>
      <p>Image filtering system with comprehensive detection capabilities.</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Detection Statistics</h2>
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
          <p><strong>Status:</strong> {stats.isRunning ? '🟢 Running' : '🔴 Stopped'}</p>
          <p><strong>Total Images:</strong> {stats.totalImages}</p>
          <p><strong>IMG Elements:</strong> {stats.imgElements}</p>
          <p><strong>Background Images:</strong> {stats.backgroundImages}</p>
          <p><strong>Processed:</strong> {stats.totalProcessed}</p>
          <p><strong>Blocked:</strong> {stats.totalBlocked}</p>
          <p><strong>Allowed:</strong> {stats.totalAllowed}</p>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <p>This system detects images in web pages using:</p>
        <ul>
          <li>IMG element detection with lazy loading support</li>
          <li>CSS background-image detection</li>
          <li>Video poster image detection</li>
          <li>Real-time mutation observer monitoring</li>
          <li>Comprehensive attribute change tracking</li>
        </ul>
      </div>
    </div>
  );
}