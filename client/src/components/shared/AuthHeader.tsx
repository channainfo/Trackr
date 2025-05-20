// components/shared/AuthHeader.tsx
import { Wallet } from "lucide-react";

export default function AuthHeader() {
  return (
    <div className="text-center mb-6">
      <div className="flex items-center justify-center mb-2">
        <Wallet className="h-8 w-8 text-primary mr-2" />
        <h1 className="text-2xl font-bold">CryptoFolio</h1>
      </div>
      <p className="text-muted-foreground">Manage your crypto portfolio like a pro</p>
    </div>
  );
}