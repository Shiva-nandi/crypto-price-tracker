
import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectAllAssets, selectLastUpdatedTimestamp } from '@/store/cryptoSlice';
import AssetRow from './AssetRow';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface CryptoTableProps {
  onToggleFeed: () => void;
  isFeedActive: boolean;
}

const CryptoTable: React.FC<CryptoTableProps> = ({ onToggleFeed, isFeedActive }) => {
  const assets = useAppSelector(selectAllAssets);
  const lastUpdateTimestamp = useAppSelector(selectLastUpdatedTimestamp);
  const { toast } = useToast();
  
  // Track which assets were recently updated for highlighting
  const [updatedAssetIds, setUpdatedAssetIds] = useState<Record<string, boolean>>({});
  
  // Update the highlighted assets when lastUpdateTimestamp changes
  useEffect(() => {
    if (lastUpdateTimestamp) {
      // Create a map of the currently updated assets
      const newUpdatedAssets: Record<string, boolean> = {};
      assets.forEach(asset => {
        // An asset is considered updated if it was updated in the last 2 seconds
        if (Math.abs(asset.lastUpdated - lastUpdateTimestamp) < 100) {
          newUpdatedAssets[asset.id] = true;
        }
      });
      
      setUpdatedAssetIds(newUpdatedAssets);
      
      // Clear highlights after animation completes
      const timer = setTimeout(() => {
        setUpdatedAssetIds({});
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [lastUpdateTimestamp, assets]);

  // Format the timestamp for display
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Cryptocurrency Market</h2>
          <p className="text-sm text-gray-500">
            Last updated: {formatTimestamp(lastUpdateTimestamp)}
          </p>
        </div>
        <Button 
          onClick={onToggleFeed}
          variant={isFeedActive ? "destructive" : "default"}
        >
          {isFeedActive ? 'Pause Feed' : 'Start Feed'}
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-xs uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 text-center w-[50px]">#</th>
              <th className="py-3 px-4 w-[200px]">Name</th>
              <th className="py-3 px-4 w-[120px]">Price</th>
              <th className="py-3 px-4 w-[80px]">1h %</th>
              <th className="py-3 px-4 w-[80px]">24h %</th>
              <th className="py-3 px-4 w-[80px]">7d %</th>
              <th className="py-3 px-4 text-right w-[120px]">Market Cap</th>
              <th className="py-3 px-4 text-right w-[120px]">24h Volume</th>
              <th className="py-3 px-4 text-right w-[150px]">Circulating Supply</th>
              <th className="py-3 px-4 text-right w-[120px]">Max Supply</th>
              <th className="py-3 px-4 w-[100px]">7d Chart</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <AssetRow 
                key={asset.id} 
                asset={asset} 
                isHighlighted={!!updatedAssetIds[asset.id]}
              />
            ))}
            {assets.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center py-8 text-gray-500">
                  No cryptocurrency data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoTable;
