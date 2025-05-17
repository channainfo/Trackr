import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AssetData {
  name: string;
  symbol: string;
  value: number;
  color: string;
  percentage: number;
}

interface AssetAllocationProps {
  assets: AssetData[];
}

export default function AssetAllocation({ assets }: AssetAllocationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || assets.length === 0) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const centerX = canvasRef.current.width / 2;
    const centerY = canvasRef.current.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    const innerRadius = radius * 0.6; // Size of inner circle

    // Draw pie chart
    let startAngle = 0;
    assets.forEach(asset => {
      const sliceAngle = (asset.percentage / 100) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      ctx.fillStyle = asset.color;
      ctx.fill();
      
      startAngle = endAngle;
    });

    // Draw inner circle for donut effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#1E1E1E' : '#FFFFFF';
    ctx.fill();

    // Draw text in center
    ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#000000';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${assets.length} Assets`, centerX, centerY);

  }, [assets]);

  if (assets.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No assets added yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Asset Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 flex justify-center">
            <canvas ref={canvasRef} width={200} height={200} />
          </div>
          <div className="w-full md:w-1/2 mt-4 md:mt-0 space-y-2">
            {assets.map((asset, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: asset.color }}
                  />
                  <span className="text-sm">{asset.name} ({asset.symbol})</span>
                </div>
                <span className="text-sm">{asset.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
