
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

// Define the interface for a crypto asset
export interface CryptoAsset {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  logo: string;
  currentPrice: number;
  priceChangePercent1h: number;
  priceChangePercent24h: number;
  priceChangePercent7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  maxSupply: number | null;
  priceHistory7d: number[];
  lastUpdated: number;
}

// Define the interface for the crypto state
interface CryptoState {
  assets: CryptoAsset[];
  loading: boolean;
  error: string | null;
  lastUpdatedTimestamp: number;
}

// Initial state with sample crypto assets
const initialState: CryptoState = {
  assets: [
    {
      id: 'bitcoin',
      rank: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      currentPrice: 65432.10,
      priceChangePercent1h: 0.15,
      priceChangePercent24h: -1.26,
      priceChangePercent7d: 3.75,
      marketCap: 1276835423568,
      volume24h: 38547921456,
      circulatingSupply: 19500000,
      maxSupply: 21000000,
      priceHistory7d: [64200, 65100, 64800, 65500, 66200, 65700, 65432],
      lastUpdated: Date.now(),
    },
    {
      id: 'ethereum',
      rank: 2,
      name: 'Ethereum',
      symbol: 'ETH',
      logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      currentPrice: 3421.54,
      priceChangePercent1h: -0.24,
      priceChangePercent24h: 2.34,
      priceChangePercent7d: 5.67,
      marketCap: 410845732156,
      volume24h: 19874563210,
      circulatingSupply: 120000000,
      maxSupply: null,
      priceHistory7d: [3280, 3350, 3420, 3380, 3410, 3450, 3421],
      lastUpdated: Date.now(),
    },
    {
      id: 'tether',
      rank: 3,
      name: 'Tether',
      symbol: 'USDT',
      logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      currentPrice: 1.00,
      priceChangePercent1h: 0.01,
      priceChangePercent24h: 0.03,
      priceChangePercent7d: -0.02,
      marketCap: 95842367510,
      volume24h: 83629451875,
      circulatingSupply: 95842367510,
      maxSupply: null,
      priceHistory7d: [1.000, 1.001, 0.999, 1.002, 1.000, 0.999, 1.000],
      lastUpdated: Date.now(),
    },
    {
      id: 'bnb',
      rank: 4,
      name: 'BNB',
      symbol: 'BNB',
      logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
      currentPrice: 589.12,
      priceChangePercent1h: 0.43,
      priceChangePercent24h: 1.05,
      priceChangePercent7d: -2.12,
      marketCap: 89762345678,
      volume24h: 2145678923,
      circulatingSupply: 152347890,
      maxSupply: 200000000,
      priceHistory7d: [602, 598, 595, 590, 585, 587, 589],
      lastUpdated: Date.now(),
    },
    {
      id: 'solana',
      rank: 5,
      name: 'Solana',
      symbol: 'SOL',
      logo: 'https://cryptologos.cc/logos/solana-sol-logo.png',
      currentPrice: 142.78,
      priceChangePercent1h: 1.12,
      priceChangePercent24h: 5.43,
      priceChangePercent7d: 12.85,
      marketCap: 62937845612,
      volume24h: 3947362518,
      circulatingSupply: 440984321,
      maxSupply: null,
      priceHistory7d: [125, 128, 132, 137, 140, 139, 142],
      lastUpdated: Date.now(),
    },
  ],
  loading: false,
  error: null,
  lastUpdatedTimestamp: Date.now(),
};

// Create the crypto slice
export const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updateAsset: (state, action: PayloadAction<Partial<CryptoAsset> & { id: string }>) => {
      const { id, ...updates } = action.payload;
      const assetIndex = state.assets.findIndex((asset) => asset.id === id);
      
      if (assetIndex !== -1) {
        state.assets[assetIndex] = { ...state.assets[assetIndex], ...updates };
        state.lastUpdatedTimestamp = Date.now();
      }
    },
    
    updateAllAssets: (state, action: PayloadAction<CryptoAsset[]>) => {
      state.assets = action.payload;
      state.lastUpdatedTimestamp = Date.now();
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Export the actions
export const { updateAsset, updateAllAssets, setLoading, setError } = cryptoSlice.actions;

// Create selectors
export const selectAllAssets = (state: RootState) => state.crypto.assets;
export const selectAssetById = (state: RootState, id: string) => 
  state.crypto.assets.find((asset) => asset.id === id);
export const selectLastUpdatedTimestamp = (state: RootState) => 
  state.crypto.lastUpdatedTimestamp;

export default cryptoSlice.reducer;
