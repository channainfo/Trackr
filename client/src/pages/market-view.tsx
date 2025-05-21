import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CryptoIcon from '@/components/crypto-icon';
import { Search, Star, StarOff, ArrowDownAZ, ArrowUpAZ, ArrowUpDown } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function MarketView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('marketCap');
  const [sortDirection, setSortDirection] = useState('desc');
  const [timeframe, setTimeframe] = useState('1d');
  const [category, setCategory] = useState('all');
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  // Query for all crypto assets
  const { data: cryptoAssets, isLoading: isLoadingCryptoAssets } = useQuery({
    queryKey: ['/api/assets'],
  });

  // This would fetch real market data from an API
  // For now, we're generating mock data based on the crypto assets
  const marketData = cryptoAssets?.map((asset: any, index: any) => {
    const randomPrice = Math.random() * (index === 0 ? 40000 : index === 1 ? 2000 : 100);
    const randomChange = (Math.random() * 20) - 10; // -10% to +10%
    const randomVolume = Math.random() * 1000000000;
    const randomMarketCap = randomPrice * (Math.random() * 1000000000);

    return {
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      price: randomPrice,
      change24h: randomChange / 100,
      change7d: (randomChange * 1.5) / 100,
      volume24h: randomVolume,
      marketCap: randomMarketCap,
      isFavorite: false,
    };
  }) || [];

  // Filter market data based on search and favorites
  const filteredMarketData = marketData
    .filter(asset => {
      if (favoriteOnly && !asset.isFavorite) {
        return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return asset.name.toLowerCase().includes(query) ||
          asset.symbol.toLowerCase().includes(query);
      }

      return true;
    })
    .sort((a, b) => {
      const factor = sortDirection === 'asc' ? 1 : -1;

      switch (sortField) {
      case 'name':
        return factor * a.name.localeCompare(b.name);
      case 'price':
        return factor * (a.price - b.price);
      case 'change24h':
        return factor * (a.change24h - b.change24h);
      case 'volume24h':
        return factor * (a.volume24h - b.volume24h);
      case 'marketCap':
      default:
        return factor * (a.marketCap - b.marketCap);
      }
    });

  // Get trending assets (top gainers)
  const trendingAssets = [...marketData]
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 4);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Handle favoriting an asset
  const toggleFavorite = (assetId: number) => {
    // This would call an API to update favorites
    // For now, just update the local state
    const assetIndex = marketData.findIndex(asset => asset.id === assetId);
    if (assetIndex >= 0) {
      marketData[assetIndex].isFavorite = !marketData[assetIndex].isFavorite;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Market Overview</h1>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for coins..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="defi">DeFi</SelectItem>
                  <SelectItem value="nft">NFT/Gaming</SelectItem>
                  <SelectItem value="layer1">Layer 1</SelectItem>
                  <SelectItem value="layer2">Layer 2</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketCap">Market Cap</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="change24h">24h Change</SelectItem>
                  <SelectItem value="volume24h">Volume</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                {sortDirection === 'asc' ? <ArrowUpAZ className="h-4 w-4" /> : <ArrowDownAZ className="h-4 w-4" />}
              </Button>

              <Button
                variant={favoriteOnly ? 'default' : 'outline'}
                size="icon"
                onClick={() => setFavoriteOnly(!favoriteOnly)}
              >
                <Star className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trending Section */}
      <h2 className="text-lg font-semibold mb-3">Trending</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {isLoadingCryptoAssets ? (
          <div className="col-span-full flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          trendingAssets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <CryptoIcon symbol={asset.symbol} size="sm" className="mr-2" />
                  <div>
                    <div className="font-medium">{asset.name}</div>
                    <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-lg font-semibold">{formatCurrency(asset.price)}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${asset.change24h >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {formatPercentage(asset.change24h)}
                  </div>
                </div>
                <div className={`price-chart mt-2 ${asset.change24h >= 0 ? 'price-up-chart' : 'price-down-chart'}`}>
                  <svg className={`price-line ${asset.change24h >= 0 ? 'price-up-line' : 'price-down-line'}`} viewBox="0 0 200 100" preserveAspectRatio="none">
                    <path d={asset.change24h >= 0 ?
                      'M0,70 C50,80 70,40 100,30 C130,20 160,50 200,40' :
                      'M0,30 C30,60 60,70 100,65 C150,60 180,40 200,50'}
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Market Data Table */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">All Cryptocurrencies</h2>

        <Tabs value={timeframe} onValueChange={setTimeframe} className="mb-4">
          <TabsList>
            <TabsTrigger value="1d">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="30d">30d</TabsTrigger>
            <TabsTrigger value="1y">1y</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center">
                    Name
                    {sortField === 'name' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort('price')}>
                  <div className="flex items-center justify-end">
                    Price
                    {sortField === 'price' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort('change24h')}>
                  <div className="flex items-center justify-end">
                    {timeframe === '1d' ? '24h' :
                      timeframe === '7d' ? '7d' :
                        timeframe === '30d' ? '30d' : '1y'}
                    {sortField === 'change24h' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer hidden md:table-cell" onClick={() => handleSort('marketCap')}>
                  <div className="flex items-center justify-end">
                    Market Cap
                    {sortField === 'marketCap' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer hidden lg:table-cell" onClick={() => handleSort('volume24h')}>
                  <div className="flex items-center justify-end">
                    Volume (24h)
                    {sortField === 'volume24h' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingCryptoAssets ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredMarketData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMarketData.map((asset, index) => {
                  const change = timeframe === '7d' ? asset.change7d : asset.change24h;
                  return (
                    <TableRow key={asset.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CryptoIcon symbol={asset.symbol} size="sm" className="mr-2" />
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(asset.price)}</TableCell>
                      <TableCell className={`text-right ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatPercentage(change)}
                      </TableCell>
                      <TableCell className="text-right font-mono hidden md:table-cell">{formatCurrency(asset.marketCap)}</TableCell>
                      <TableCell className="text-right font-mono hidden lg:table-cell">{formatCurrency(asset.volume24h)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(asset.id)}
                        >
                          {asset.isFavorite ? (
                            <Star className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <StarOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
