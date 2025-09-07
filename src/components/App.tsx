import React, { useState, useEffect } from 'react';
import { CleanWebCore } from '@/business-logic';
import { FilterSettings } from '@/types';
import { CleanWebControls } from './CleanWebControls';

export const App: React.FC = () => {
  const [core, setCore] = useState<CleanWebCore | null>(null);

  useEffect(() => {
    // Initialize with default settings
    const defaultSettings: FilterSettings = {
      nudityThreshold: 5,
      strictMode: false,
      allowList: [],
      blockList: []
    };

    const cleanWebCore = new CleanWebCore(defaultSettings);
    setCore(cleanWebCore);

    return () => {
      cleanWebCore.stop();
    };
  }, []);

  if (!core) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <header>
        <h1>Clean Web - Image Filter</h1>
        <p>Block problematic images from rendering in web pages</p>
      </header>
      
      <main>
        <CleanWebControls core={core} />
      </main>
      
      <footer>
        <p>Clean Web - Generic infrastructure for content filtering</p>
      </footer>
    </div>
  );
};