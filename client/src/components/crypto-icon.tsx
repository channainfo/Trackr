import { Bitcoin, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface CryptoIconProps {
  symbol: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CryptoIcon({ symbol, size = "md", className }: CryptoIconProps) {
  const sizeClass = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const getIconForSymbol = () => {
    // Map of crypto symbols to colors and icons
    const cryptoIcons: Record<string, { color: string; icon: React.ReactNode }> = {
      BTC: {
        color: "bg-orange-500/20 text-orange-500",
        icon: <Bitcoin className="w-4 h-4" />,
      },
      ETH: {
        color: "bg-indigo-500/20 text-indigo-500",
        icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 12L12 16L21 12L12 2Z" fill="currentColor"/>
          <path d="M12 16L3 12L12 22L21 12L12 16Z" fill="currentColor"/>
        </svg>,
      },
      SOL: {
        color: "bg-purple-500/20 text-purple-500",
        icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 15.5H18.5L16 18H3.5L6 15.5Z" fill="currentColor"/>
          <path d="M6 6H18.5L16 8.5H3.5L6 6Z" fill="currentColor"/>
          <path d="M6 10.75H18.5L16 13.25H3.5L6 10.75Z" fill="currentColor"/>
        </svg>,
      },
      ADA: {
        color: "bg-blue-500/20 text-blue-500",
        icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L19 12L12 22L5 12L12 2Z" fill="currentColor"/>
        </svg>,
      },
      DOT: {
        color: "bg-pink-500/20 text-pink-500",
        icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" fill="currentColor"/>
          <circle cx="12" cy="3" r="2" fill="currentColor"/>
          <circle cx="12" cy="21" r="2" fill="currentColor"/>
          <circle cx="3" cy="12" r="2" fill="currentColor"/>
          <circle cx="21" cy="12" r="2" fill="currentColor"/>
        </svg>,
      },
    };

    return cryptoIcons[symbol] || {
      color: "bg-gray-500/20 text-gray-500",
      icon: <Coins className="w-4 h-4" />,
    };
  };

  const { color, icon } = getIconForSymbol();

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center",
        color,
        sizeClass[size],
        className
      )}
    >
      {icon}
    </div>
  );
}
