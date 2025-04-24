
import { AppDispatch } from '../store/store';
import { updateAsset } from '../store/cryptoSlice';
import { toast } from '@/components/ui/use-toast';
import { store } from '../store/store';

// Interface for the simulator configuration
interface CryptoSocketConfig {
  updateInterval: number; // milliseconds between updates
  priceVolatility: number; // percentage of price change limit per update
  volumeVolatility: number; // percentage of volume change limit per update
}

export class CryptoSocketSimulator {
  private intervalId: number | null = null;
  private dispatch: AppDispatch;
  private config: CryptoSocketConfig;
  private assetIds: string[];
  private updateQueue: Map<string, number> = new Map(); // Queue to throttle updates

  constructor(
    dispatch: AppDispatch,
    assetIds: string[],
    config: CryptoSocketConfig = {
      updateInterval: 2000, // 2 seconds
      priceVolatility: 0.5, // 0.5% max change per update
      volumeVolatility: 1, // 1% max change per update
    }
  ) {
    this.dispatch = dispatch;
    this.config = config;
    this.assetIds = assetIds;
  }

  // Start the simulation
  start(): void {
    if (this.intervalId !== null) {
      return; // Already running
    }

    // Show a toast notification that the market feed is connected
    toast({
      title: "Market Feed Connected",
      description: "Live price updates are now streaming",
    });

    // Set interval and store the ID for later cleanup
    this.intervalId = setInterval(() => {
      // Randomly select which assets to update (1-3 assets at a time)
      const numAssetsToUpdate = Math.floor(Math.random() * 2) + 1; // Reduced to 1-2 assets at a time
      const shuffledAssets = [...this.assetIds].sort(() => 0.5 - Math.random());
      const assetsToUpdate = shuffledAssets.slice(0, numAssetsToUpdate);

      // Update each selected asset
      assetsToUpdate.forEach(assetId => {
        // Only update if not recently updated (throttle updates)
        const lastUpdate = this.updateQueue.get(assetId) || 0;
        const now = Date.now();
        
        if (now - lastUpdate > 3000) { // Ensure at least 3 seconds between updates to the same asset
          this.generateAssetUpdate(assetId);
          this.updateQueue.set(assetId, now);
        }
      });
    }, this.config.updateInterval) as unknown as number;
  }

  // Stop the simulation
  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      
      // Show a toast notification that the market feed is disconnected
      toast({
        title: "Market Feed Disconnected",
        description: "Price updates have been paused",
        variant: "destructive",
      });
    }
  }

  // Generate a random update for an asset
  private generateAssetUpdate(assetId: string): void {
    // Calculate random price change (within volatility limit)
    const priceChangePercent = (Math.random() * 2 - 1) * this.config.priceVolatility;
    
    // Calculate random volume change (within volatility limit)
    const volumeChangePercent = (Math.random() * 2 - 1) * this.config.volumeVolatility;
    
    // Dispatch update to Redux
    this.dispatch(updateAsset({
      id: assetId,
      // Price updates
      currentPrice: this.calculateNewPrice(assetId, priceChangePercent),
      priceChangePercent1h: this.generateNewPercentageChange(),
      priceChangePercent24h: this.generateNewPercentageChange(),
      priceChangePercent7d: this.generateNewPercentageChange(),
      // Volume update
      volume24h: this.calculateNewVolume(assetId, volumeChangePercent),
      // Update timestamp
      lastUpdated: Date.now()
    }));
  }

  // Helper to calculate new price based on percentage change
  private calculateNewPrice(assetId: string, percentChange: number): number {
    const state = store.getState();
    const asset = state.crypto.assets.find((a: any) => a.id === assetId);
    
    if (!asset) return 0;
    
    // Calculate new price with precision based on price magnitude
    const newPrice = asset.currentPrice * (1 + percentChange / 100);
    
    // Format based on price level
    if (newPrice < 0.01) return parseFloat(newPrice.toFixed(6));
    if (newPrice < 1) return parseFloat(newPrice.toFixed(4));
    if (newPrice < 100) return parseFloat(newPrice.toFixed(2));
    return parseFloat(newPrice.toFixed(2));
  }

  // Helper to calculate new volume based on percentage change
  private calculateNewVolume(assetId: string, percentChange: number): number {
    const state = store.getState();
    const asset = state.crypto.assets.find((a: any) => a.id === assetId);
    
    if (!asset) return 0;
    
    // Calculate new volume
    const newVolume = asset.volume24h * (1 + percentChange / 100);
    
    // Return as integer
    return Math.round(newVolume);
  }

  // Helper to generate realistic percentage changes
  private generateNewPercentageChange(): number {
    // Generate a value mostly between -3 and +3 with occasional larger moves (reduced volatility)
    let change = (Math.random() * 6 - 3);
    
    // Sometimes generate larger moves (5% chance instead of 10%)
    if (Math.random() > 0.95) {
      change = change * 1.5;
    }
    
    return parseFloat(change.toFixed(2));
  }
}

// Helper functions for formatting
export const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: num < 1 ? 4 : 2,
    maximumFractionDigits: num < 1 ? 6 : 2
  }).format(num);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatCompactNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', { 
    notation: "compact",
    compactDisplay: "short"
  }).format(num);
};

export const formatPercentage = (percent: number): string => {
  return `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`;
};
