import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
  passwordStrength: number;
}

export function PasswordStrengthIndicator({
  password,
  passwordStrength,
}: PasswordStrengthIndicatorProps) {
  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-muted";
    if (passwordStrength === 1) return "bg-destructive";
    if (passwordStrength === 2) return "bg-amber-500";
    if (passwordStrength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return "Password strength";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="mt-2">
      <div className="space-y-2">
        <div>
          <Progress value={passwordStrength * 25} className={getStrengthColor()} />
          <p className={`text-xs mt-1 ${passwordStrength > 0 ? getStrengthColor().replace('bg-', 'text-') : 'text-muted-foreground'}`}>
            {getStrengthText()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-xs flex items-center">
            {/[A-Z]/.test(password) ? (
              <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <XCircle className="mr-1 h-3 w-3 text-muted-foreground" />
            )}
            <span className={/[A-Z]/.test(password) ? "text-green-500" : "text-muted-foreground"}>
              Uppercase letter
            </span>
          </div>
          <div className="text-xs flex items-center">
            {/[0-9]/.test(password) ? (
              <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <XCircle className="mr-1 h-3 w-3 text-muted-foreground" />
            )}
            <span className={/[0-9]/.test(password) ? "text-green-500" : "text-muted-foreground"}>
              Number
            </span>
          </div>
          <div className="text-xs flex items-center">
            {password.length >= 8 ? (
              <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <XCircle className="mr-1 h-3 w-3 text-muted-foreground" />
            )}
            <span className={password.length >= 8 ? "text-green-500" : "text-muted-foreground"}>
              Min. 8 characters
            </span>
          </div>
          <div className="text-xs flex items-center">
            {/[^A-Za-z0-9]/.test(password) ? (
              <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <XCircle className="mr-1 h-3 w-3 text-muted-foreground" />
            )}
            <span className={/[^A-Za-z0-9]/.test(password) ? "text-green-500" : "text-muted-foreground"}>
              Special character
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}