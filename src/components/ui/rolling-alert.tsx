
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RollingAlertProps {
  messages: string[];
  variant?: "default" | "primary" | "success" | "warning" | "info";
  icon?: React.ReactNode;
  autoScroll?: boolean;
  interval?: number;
  className?: string;
  dismissible?: boolean;
}

export function RollingAlert({
  messages,
  variant = "default",
  icon = <Bell className="h-4 w-4" />,
  autoScroll = true,
  interval = 5000,
  className,
  dismissible = true,
}: RollingAlertProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messages.length || !autoScroll || isPaused) return;

    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
        setIsAnimating(false);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [messages.length, autoScroll, interval, isPaused]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrevious = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + messages.length) % messages.length);
      setIsAnimating(false);
    }, 300);
  };

  if (!isVisible || messages.length === 0) return null;

  const variantStyles = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    primary: "bg-gradient-to-r from-primary-100 to-blue-100 text-primary-800 border-primary-200",
    success: "bg-gradient-to-r from-green-100 to-teal-100 text-green-800 border-green-200",
    warning: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200",
    info: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200",
  };

  return (
    <div 
      className={cn(
        "border rounded-md overflow-hidden shadow-sm",
        variantStyles[variant],
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={alertRef}
    >
      <div className="flex items-center p-3">
        <div className="flex-shrink-0 mr-3">
          {icon}
        </div>
        
        <div className="flex-1 relative overflow-hidden">
          <div 
            className={cn(
              "transition-all duration-300",
              isAnimating ? "opacity-0 transform -translate-y-1" : "opacity-100 transform translate-y-0"
            )}
          >
            <p className="text-sm font-medium">{messages[currentIndex]}</p>
          </div>
          
          {messages.length > 1 && (
            <div className="text-xs text-muted-foreground mt-1">
              {currentIndex + 1} of {messages.length}
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 flex items-center gap-1 ml-2">
          {messages.length > 1 && (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full"
                onClick={handlePrevious}
              >
                <span className="sr-only">Previous</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full"
                onClick={handleNext}
              >
                <span className="sr-only">Next</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </Button>
            </>
          )}
          
          {dismissible && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full ml-1"
              onClick={handleDismiss}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
