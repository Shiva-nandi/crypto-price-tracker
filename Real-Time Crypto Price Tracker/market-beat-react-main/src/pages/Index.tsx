
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import { selectAllAssets } from '@/store/cryptoSlice';
import { CryptoSocketSimulator } from '@/services/cryptoSocketSimulator';
import CryptoTable from '@/components/CryptoTable';

// Main app wrapped with Redux provider
const Index = () => {
  return (
    <Provider store={store}>
      <CryptoMarketApp />
    </Provider>
  );
};

// The actual component that uses Redux
const CryptoMarketApp = () => {
  const dispatch = useAppDispatch();
  const [simulator, setSimulator] = useState<CryptoSocketSimulator | null>(null);
  const [isFeedActive, setIsFeedActive] = useState(true);

  // Initialize the simulator
  useEffect(() => {
    // Get the list of asset IDs for the simulator
    const assetIds = store.getState().crypto.assets.map(asset => asset.id);
    
    // Create the simulator
    const newSimulator = new CryptoSocketSimulator(dispatch, assetIds);
    setSimulator(newSimulator);
    
    // Start the simulator initially
    newSimulator.start();
    
    // Cleanup on unmount
    return () => {
      if (newSimulator) {
        newSimulator.stop();
      }
    };
  }, [dispatch]);

  // Toggle the feed
  const handleToggleFeed = () => {
    if (!simulator) return;
    
    if (isFeedActive) {
      simulator.stop();
    } else {
      simulator.start();
    }
    
    setIsFeedActive(!isFeedActive);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Market Beat</h1>
          <p className="text-gray-600">Real-time cryptocurrency price tracker</p>
        </header>
        
        <div className="space-y-8">
          <CryptoTable 
            onToggleFeed={handleToggleFeed} 
            isFeedActive={isFeedActive} 
          />
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">About This App</h2>
            <p className="text-gray-700 mb-3">
              Market Beat is a demo cryptocurrency price tracking application built with React and Redux Toolkit.
              It simulates real-time WebSocket updates to showcase state management using Redux.
            </p>
            <p className="text-gray-700">
              All price updates are managed through Redux actions and slices, with optimized 
              re-renders using selector functions. The "live" updates are simulated and occur 
              approximately every 2 seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
