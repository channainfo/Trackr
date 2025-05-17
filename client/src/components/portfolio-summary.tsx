import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercentage, cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Plus, Download } from "lucide-react";

interface PortfolioSummaryProps {
  totalBalance: number;
  dailyChange: number;
  dailyChangePercentage: number;
  onAddAsset: () => void;
  onExport: () => void;
}

export default function PortfolioSummary({
  totalBalance,
  dailyChange,
  dailyChangePercentage,
  onAddAsset,
  onExport,
}: PortfolioSummaryProps) {
  const isPositiveChange = dailyChange >= 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardDescription>Total Balance</CardDescription>
        <div className="flex items-baseline space-x-2">
          <CardTitle className="text-3xl font-mono">
            {formatCurrency(totalBalance)}
          </CardTitle>
          <span
            className={cn(
              "inline-flex items-center text-sm px-2 py-1 rounded-full",
              isPositiveChange
                ? "text-green-500 bg-green-500/10"
                : "text-red-500 bg-red-500/10"
            )}
          >
            {isPositiveChange ? (
              <ArrowUpRight className="mr-1 h-3 w-3" />
            ) : (
              <ArrowDownRight className="mr-1 h-3 w-3" />
            )}
            {formatPercentage(dailyChangePercentage)}
          </span>
        </div>
        <CardDescription className={cn(
          isPositiveChange ? "text-green-500" : "text-red-500"
        )}>
          {isPositiveChange ? "+" : ""}{formatCurrency(dailyChange)} (24h)
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex space-x-2">
          <Button className="flex items-center" onClick={onAddAsset}>
            <Plus className="mr-1 h-4 w-4" />
            Add Asset
          </Button>
          <Button variant="outline" className="flex items-center" onClick={onExport}>
            <Download className="mr-1 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
