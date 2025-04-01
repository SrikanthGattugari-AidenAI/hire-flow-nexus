
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AlertBannerProps {
  message: string;
  variant?: "default" | "success" | "info" | "warning" | "error";
  icon?: React.ReactNode;
  closable?: boolean;
  className?: string;
  autoClose?: boolean;
  autoCloseTime?: number;
}

export function AlertBanner({
  message,
  variant = "default",
  icon,
  closable = true,
  className,
  autoClose = false,
  autoCloseTime = 5000,
}: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setIsAnimating(true);

    if (autoClose) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => setIsVisible(false), 300);
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [message, autoClose, autoCloseTime]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  const variantStyles = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    success: "bg-green-100 text-green-800 border-green-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isAnimating ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 border-b shadow-sm",
          variantStyles[variant],
          className
        )}
      >
        <div className="flex items-center space-x-2">
          {icon && <span>{icon}</span>}
          <span 
            className={cn(
              "text-sm font-medium whitespace-nowrap overflow-hidden", 
              "animate-[marquee_15s_linear_infinite]"
            )}
          >
            {message}
          </span>
        </div>
        {closable && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>
    </div>
  );
}
