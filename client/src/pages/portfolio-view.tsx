import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Loader2, Plus } from 'lucide-react';
import PortfolioSummary from '@/components/portfolio-summary';
import AssetAllocation from '@/components/asset-allocation';
import CryptoCard from '@/components/crypto-card';

// Form schema for adding a new asset
const addAssetSchema = z.object({
  assetId: z.string().min(1, { message: 'Please select an asset' }),
  amount: z.string().min(1, { message: 'Please enter an amount' }),
  purchasePrice: z.string().optional(),
});

type AddAssetFormValues = z.infer<typeof addAssetSchema>;

export default function PortfolioView() {
  const { user } = useAuth();
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);

  // Query for user portfolios
  const { data: portfolios, isLoading: isLoadingPortfolios } = useQuery({
    queryKey: ['/api/portfolios'],
    enabled: !!user,
  });

  // Use the first portfolio by default (most users will only have one)
  const defaultPortfolio = portfolios && portfolios.length > 0 ? portfolios[0] : null;

  // Query for portfolio assets
  const { data: portfolioAssets, isLoading: isLoadingAssets } = useQuery({
    queryKey: ['/api/portfolios', defaultPortfolio?.id, 'assets'],
    enabled: !!defaultPortfolio,
  });

  // Query for available crypto assets
  const { data: cryptoAssets, isLoading: isLoadingCryptoAssets } = useQuery({
    queryKey: ['/api/assets'],
  });

  // Form for adding new assets
  const form = useForm<AddAssetFormValues>({
    resolver: zodResolver(addAssetSchema),
    defaultValues: {
      assetId: '',
      amount: '',
      purchasePrice: '',
    },
  });

  // Mock data for demonstration purposes
  // In reality, this would come from the API
  const mockTotalBalance = 34281.67;
  const mockDailyChange = 1823.45;
  const mockDailyChangePercentage = 0.056;

  // Prepare the asset allocation data
  const assetAllocationData = portfolioAssets
    ? portfolioAssets.map((asset, index) => {
      // Calculate value and percentage for each asset
      const value = parseFloat(asset.amount) * 1000; // This would be calculated with real price data
      const percentage = (value / mockTotalBalance) * 100;

      // List of colors for the chart
      const colors = [
        'hsl(var(--chart-1))',
        'hsl(var(--chart-2))',
        'hsl(var(--chart-3))',
        'hsl(var(--chart-4))',
        'hsl(var(--chart-5))',
      ];

      return {
        name: asset.asset.name,
        symbol: asset.asset.symbol,
        value: value,
        color: colors[index % colors.length],
        percentage: percentage,
      };
    })
    : [];

  // Handle adding a new asset
  const handleAddAsset = async (values: AddAssetFormValues) => {
    if (!defaultPortfolio) return;

    try {
      await apiRequest('POST', `/api/portfolios/${defaultPortfolio.id}/assets`, {
        assetId: parseInt(values.assetId),
        amount: values.amount,
        purchasePrice: values.purchasePrice || undefined,
      });

      // Invalidate the portfolio assets query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/portfolios', defaultPortfolio.id, 'assets'] });
      setIsAddAssetOpen(false);
      form.reset();
    } catch (error) {
      console.error('Failed to add asset:', error);
    }
  };

  // Handle export portfolio
  const handleExportPortfolio = () => {
    // This would export the portfolio data to CSV/PDF
    alert('Export feature would be implemented here');
  };

  if (isLoadingPortfolios || (!defaultPortfolio && !isLoadingPortfolios)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        {isLoadingPortfolios ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">No Portfolio Found</h2>
            <p className="text-muted-foreground mb-4">Let's create your first portfolio</p>
            <Button>Create Portfolio</Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Portfolio</h1>

      {/* Portfolio Summary */}
      <div className="mb-6">
        <PortfolioSummary
          totalBalance={mockTotalBalance}
          dailyChange={mockDailyChange}
          dailyChangePercentage={mockDailyChangePercentage}
          onAddAsset={() => setIsAddAssetOpen(true)}
          onExport={handleExportPortfolio}
        />
      </div>

      {/* Portfolio Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Asset Allocation */}
        <div className="md:col-span-1">
          <AssetAllocation assets={assetAllocationData} />
        </div>

        {/* Performance Chart */}
        <div className="md:col-span-2 bg-card rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Performance</h2>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm" className="h-8">1D</Button>
              <Button variant="ghost" size="sm" className="h-8">1W</Button>
              <Button variant="ghost" size="sm" className="h-8">1M</Button>
              <Button variant="ghost" size="sm" className="h-8">1Y</Button>
              <Button variant="ghost" size="sm" className="h-8">All</Button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">Performance chart visualization would go here</p>
          </div>
        </div>
      </div>

      {/* Asset List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Assets</h2>
        {isLoadingAssets ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : portfolioAssets && portfolioAssets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolioAssets.map((asset, index) => (
              <CryptoCard
                key={asset.id}
                name={asset.asset.name}
                symbol={asset.asset.symbol}
                amount={asset.amount}
                price={1000} // This would be the current price from an API
                value={parseFloat(asset.amount) * 1000} // This would be calculated with real price data
                priceChange24h={index % 2 === 0 ? 0.034 : -0.021} // This would be real data
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-card rounded-lg">
            <h3 className="text-lg font-semibold mb-2">No assets in your portfolio yet</h3>
            <p className="text-muted-foreground mb-4">Add some assets to start tracking your portfolio</p>
            <Button onClick={() => setIsAddAssetOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Asset
            </Button>
          </div>
        )}
      </div>

      {/* Add Asset Dialog */}
      <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddAsset)} className="space-y-4">
              <FormField
                control={form.control}
                name="assetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an asset" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingCryptoAssets ? (
                          <div className="flex justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : (
                          cryptoAssets && cryptoAssets.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id.toString()}>
                              {asset.name} ({asset.symbol})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0.00"
                        {...field}
                        type="number"
                        step="any"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0.00"
                        {...field}
                        type="number"
                        step="any"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsAddAssetOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Asset</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
