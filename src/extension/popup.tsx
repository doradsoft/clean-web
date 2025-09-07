import React from 'react';
import ReactDOM from 'react-dom/client';

interface Stats {
  total: number;
  img: number;
  background: number;
  video: number;
}

const PopupApp: React.FC = () => {
  const [stats, setStats] = React.useState<Stats>({ total: 0, img: 0, background: 0, video: 0 });

  const updateStats = React.useCallback(async () => {
    try {
      // Get the active tab and execute script to get stats
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab?.id) {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            // This function runs in the content script context
            // We need to get the stats from the CleanWebCore instance
            const event = new CustomEvent('getCleanWebStats');
            document.dispatchEvent(event);
            
            // For now, return placeholder stats
            // In a real implementation, this would communicate with the content script
            return {
              total: (window as any).cleanWebStats?.total || 0,
              img: (window as any).cleanWebStats?.img || 0,
              background: (window as any).cleanWebStats?.background || 0,
              video: (window as any).cleanWebStats?.video || 0
            };
          }
        });

        if (results[0]?.result) {
          setStats(results[0].result);
        }
      }
    } catch (error) {
      console.error('Failed to get stats:', error);
    }
  }, []);

  React.useEffect(() => {
    updateStats();
  }, [updateStats]);

  return (
    <div style={{ width: '300px', padding: '16px', fontFamily: 'system-ui' }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h1 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>Clean Web</h1>
        <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>Image Detection Stats</p>
      </div>
      
      <div style={{ background: 'white', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
          <span>Total Images:</span>
          <span style={{ fontWeight: 'bold' }}>{stats.total}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
          <span>IMG Elements:</span>
          <span style={{ fontWeight: 'bold' }}>{stats.img}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
          <span>Background Images:</span>
          <span style={{ fontWeight: 'bold' }}>{stats.background}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
          <span>Video Posters:</span>
          <span style={{ fontWeight: 'bold' }}>{stats.video}</span>
        </div>
        
        <button 
          onClick={updateStats}
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>
      
      <div style={{ textAlign: 'center', color: '#10b981', fontSize: '12px', marginTop: '12px' }}>
        Extension Active
      </div>
    </div>
  );
};

// Mount the React app
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<PopupApp />);
} else {
  // Fallback to vanilla JS if React mount fails
  document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh');
    const totalCount = document.getElementById('total-count');
    const imgCount = document.getElementById('img-count');
    const bgCount = document.getElementById('bg-count');
    const videoCount = document.getElementById('video-count');

    async function updateStats() {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (tab?.id) {
          // For now, set placeholder values
          // In a real implementation, this would communicate with content script
          if (totalCount) totalCount.textContent = '0';
          if (imgCount) imgCount.textContent = '0';
          if (bgCount) bgCount.textContent = '0';
          if (videoCount) videoCount.textContent = '0';
        }
      } catch (error) {
        console.error('Failed to get stats:', error);
      }
    }

    refreshBtn?.addEventListener('click', updateStats);
    updateStats();
  });
}