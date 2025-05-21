import { cn, formatCurrency, formatCryptoAmount, formatPercentage } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import CryptoIcon from './crypto-icon';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface CryptoCardProps {
  name: string;
  symbol: string;
  amount: string;
  price: number;
  value: number;
  priceChange24h: number;
  className?: string;
}

export default function CryptoCard({
  name,
  symbol,
  amount,
  price,
  value,
  priceChange24h,
  className,
}: CryptoCardProps) {
  const isPriceUp = priceChange24h >= 0;

  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-md', className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CryptoIcon symbol={symbol} size="md" />
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">{symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{formatCurrency(price)}</p>
            <p
              className={cn(
                'text-sm flex items-center justify-end',
                isPriceUp ? 'text-green-500' : 'text-red-500',
              )}
            >
              {isPriceUp ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              {formatPercentage(priceChange24h)}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>{formatCryptoAmount(amount, symbol)}</span>
            <span>{formatCurrency(value)}</span>
          </div>
          <div className="w-full h-1.5 bg-secondary rounded-full">
            <div
              className={cn(
                'h-full rounded-full',
                isPriceUp ? 'bg-green-500' : 'bg-red-500',
              )}
              style={{ width: `${Math.min(Math.abs(priceChange24h) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
