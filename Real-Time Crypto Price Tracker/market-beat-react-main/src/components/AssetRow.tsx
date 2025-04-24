
import React, { useEffect, useState, memo } from 'react';
import { CryptoAsset } from '@/store/cryptoSlice';
import { formatCurrency, formatNumber, formatCompactNumber, formatPercentage } from '@/services/cryptoSocketSimulator';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import PriceChart from './PriceChart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AssetRowProps {
  asset: CryptoAsset;
  isHighlighted: boolean;
}

// Memoize the component to prevent unnecessary re-renders
const AssetRow: React.FC<AssetRowProps> = memo(({ asset, isHighlighted }) => {
  const [animate, setAnimate] = useState(false);
  const [prevPrice, setPrevPrice] = useState(asset.currentPrice);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Determine if price went up or down
  const priceDirection = asset.currentPrice > prevPrice ? 'up' : 
                         asset.currentPrice < prevPrice ? 'down' : null;
  
  // Trigger animation whenever the asset is updated
  useEffect(() => {
    if (isHighlighted) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 1000);
      
      // Update the previous price after animation completes
      if (asset.currentPrice !== prevPrice) {
        setPrevPrice(asset.currentPrice);
      }
      
      return () => clearTimeout(timeout);
    }
  }, [asset.currentPrice, isHighlighted, prevPrice]);

  // Helper function for styling percentage values
  const renderPercentage = (value: number) => {
    const isPositive = value >= 0;
    return (
      <div className={cn(
        "flex items-center",
        isPositive ? "text-positive" : "text-negative"
      )}>
        {isPositive ? (
          <ArrowUp className="h-4 w-4 mr-1" />
        ) : (
          <ArrowDown className="h-4 w-4 mr-1" />
        )}
        {formatPercentage(value)}
      </div>
    );
  };

  return (
    <tr className={cn(
      "border-b border-gray-200 hover:bg-gray-50 transition-colors",
      animate ? "bg-gray-100" : ""
    )}>
      <td className="py-4 px-4 text-center w-[50px]">{asset.rank}</td>
      <td className="py-4 px-4 w-[200px]">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-3 flex-shrink-0">
            <Avatar className="w-8 h-8">
              <AvatarImage 
                src={asset.logo}
                alt={`${asset.name} logo`}
                className="object-contain"
                onLoad={() => setImageLoaded(true)}
              />
              <AvatarFallback className="text-xs font-medium">
                {asset.symbol.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-medium whitespace-nowrap text-ellipsis overflow-hidden">{asset.name}</span>
            <span className="text-gray-500 text-sm whitespace-nowrap">{asset.symbol}</span>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 font-mono w-[120px]">
        <div className={cn(
          "transition-colors",
          priceDirection === 'up' ? "text-positive" : 
          priceDirection === 'down' ? "text-negative" : ""
        )}>
          {formatCurrency(asset.currentPrice)}
        </div>
      </td>
      <td className="py-4 px-4 w-[80px]">{renderPercentage(asset.priceChangePercent1h)}</td>
      <td className="py-4 px-4 w-[80px]">{renderPercentage(asset.priceChangePercent24h)}</td>
      <td className="py-4 px-4 w-[80px]">{renderPercentage(asset.priceChangePercent7d)}</td>
      <td className="py-4 px-4 text-right font-mono w-[120px]">{formatCompactNumber(asset.marketCap)}</td>
      <td className="py-4 px-4 text-right font-mono w-[120px]">{formatCompactNumber(asset.volume24h)}</td>
      <td className="py-4 px-4 text-right font-mono w-[150px]">
        {formatNumber(Math.round(asset.circulatingSupply))} {asset.symbol}
      </td>
      <td className="py-4 px-4 text-right font-mono w-[120px]">
        {asset.maxSupply ? formatNumber(asset.maxSupply) : '∞'} {asset.symbol}
      </td>
      <td className="py-4 px-4 w-[100px]">
        <PriceChart data={asset.priceHistory7d} percentChange={asset.priceChangePercent7d} />
      </td>
    </tr>
  );
});

export default AssetRow;
