import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight, ArrowDownRight, MoveUpLeft, Filter, Download, Plus } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { formatCurrency, formatCryptoAmount } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Form schema for adding a new transaction
const addTransactionSchema = z.object({
  assetId: z.string().min(1, { message: 'Please select an asset' }),
  type: z.string().min(1, { message: 'Please select a transaction type' }),
  amount: z.string().min(1, { message: 'Please enter an amount' }),
  price: z.string().min(1, { message: 'Please enter a price' }),
  note: z.string().optional(),
});

type AddTransactionFormValues = z.infer<typeof addTransactionSchema>;

export default function ActivityView() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  // Query for user transactions
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['/api/transactions'],
  });

  // Query for available crypto assets
  const { data: cryptoAssets, isLoading: isLoadingCryptoAssets } = useQuery({
    queryKey: ['/api/assets'],
  });

  // Form for adding new transactions
  const form = useForm<AddTransactionFormValues>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      assetId: '',
      type: '',
      amount: '',
      price: '',
      note: '',
    },
  });

  // Filter transactions based on type
  const filteredTransactions = transactions
    ? transactions.filter(transaction => {
      if (activeTab !== 'all' && transaction.type !== activeTab) {
        return false;
      }

      if (dateFilter) {
        const transactionDate = new Date(transaction.timestamp);
        const filterDate = new Date(dateFilter);

        return transactionDate.toDateString() === filterDate.toDateString();
      }

      return true;
    })
    : [];

  // Handle adding a new transaction
  const handleAddTransaction = async (values: AddTransactionFormValues) => {
    try {
      await apiRequest('POST', '/api/transactions', {
        assetId: parseInt(values.assetId),
        type: values.type,
        amount: values.amount,
        price: values.price,
        note: values.note,
      });

      // Invalidate the transactions query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      setIsAddTransactionOpen(false);
      form.reset();
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  // Transaction type icons
  const typeIcons = {
    buy: <ArrowDownRight className="h-5 w-5 text-green-500" />,
    sell: <ArrowUpRight className="h-5 w-5 text-red-500" />,
    transfer: <MoveUpLeft className="h-5 w-5 text-blue-500" />,
  };

  // Handle export transactions
  const handleExportTransactions = () => {
    // This would export transactions to CSV
    alert('Export feature would be implemented here');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="md:mr-auto"
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="buy">Buys</TabsTrigger>
                <TabsTrigger value="sell">Sells</TabsTrigger>
                <TabsTrigger value="transfer">Transfers</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <div className="relative">
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-40"
                />
              </div>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="icon" onClick={handleExportTransactions}>
                <Download className="h-4 w-4" />
              </Button>

              <Button onClick={() => setIsAddTransactionOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <div className="space-y-4">
        {isLoadingTransactions ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8 bg-card rounded-lg">
            <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
            <p className="text-muted-foreground mb-4">
              {activeTab !== 'all'
                ? `You don't have any ${activeTab} transactions${dateFilter ? ' on the selected date' : ''}.`
                : dateFilter
                  ? 'No transactions on the selected date.'
                  : 'Start by adding your first transaction.'}
            </p>
            <Button onClick={() => setIsAddTransactionOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Transaction
            </Button>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                      {typeIcons[transaction.type as keyof typeof typeIcons] ||
                        <MoveUpLeft className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-semibold capitalize">
                        {transaction.type} {transaction.asset.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(transaction.timestamp).toLocaleDateString()} •
                        {new Date(transaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {transaction.type === 'buy' ? '+' : transaction.type === 'sell' ? '-' : ''}
                      {formatCryptoAmount(transaction.amount, transaction.asset.symbol)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(parseFloat(transaction.amount) * parseFloat(transaction.price))}
                    </div>
                  </div>
                </div>
                {transaction.note && (
                  <div className="mt-2 text-sm text-muted-foreground border-t border-muted pt-2">
                    {transaction.note}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddTransaction)} className="space-y-4">
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
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
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
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
              </div>

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Add a note for this transaction"
                        {...field}
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
                  onClick={() => setIsAddTransactionOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Transaction</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
